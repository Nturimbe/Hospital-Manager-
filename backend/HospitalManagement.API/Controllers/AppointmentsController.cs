using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private static readonly string[] AllowedStatuses =
        { "Scheduled", "Completed", "Cancelled" };

    private readonly ApplicationDbContext _context;

    public AppointmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAll()
    {
        var appointments = await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }
        [HttpGet("{id:int}")]
    public async Task<ActionResult<Appointment>> GetById(int id)
    {
        var appointment = await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

        return appointment is null ? NotFound() : Ok(appointment);
    }

    [HttpGet("patient/{patientId:int}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetForPatient(int patientId)
    {
        if (!await _context.Patients.AnyAsync(p => p.Id == patientId))
            return NotFound("Patient not found.");

        var appointments = await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Where(a => a.PatientId == patientId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }

    [HttpGet("doctor/{doctorId:int}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetForDoctor(int doctorId)
    {
        if (!await _context.Doctors.AnyAsync(d => d.Id == doctorId))
            return NotFound("Doctor not found.");

        var appointments = await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();

        return Ok(appointments);
    }

    [HttpPost]
    public async Task<ActionResult<Appointment>> Create(AppointmentDto dto)
    {
        if (!await _context.Patients.AnyAsync(p => p.Id == dto.PatientId))
            return BadRequest("Patient does not exist.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId))
            return BadRequest("Doctor does not exist.");

        if (dto.AppointmentDate <= DateTime.UtcNow)
            return BadRequest("Appointment must be scheduled for a future date and time.");

        var doctorBusy = await _context.Appointments.AnyAsync(a =>
            a.DoctorId == dto.DoctorId &&
            a.AppointmentDate == dto.AppointmentDate &&
            a.Status == "Scheduled");

        if (doctorBusy)
            return Conflict("The doctor already has an appointment at this time.");

        var patientBusy = await _context.Appointments.AnyAsync(a =>
            a.PatientId == dto.PatientId &&
            a.AppointmentDate == dto.AppointmentDate &&
            a.Status == "Scheduled");

        if (patientBusy)
            return Conflict("The patient already has an appointment at this time.");

        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = dto.AppointmentDate,
            Reason = dto.Reason.Trim(),
            Status = "Scheduled"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = appointment.Id }, appointment);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AppointmentDto dto)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        if (!await _context.Patients.AnyAsync(p => p.Id == dto.PatientId))
            return BadRequest("Patient does not exist.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId))
            return BadRequest("Doctor does not exist.");

        if (dto.AppointmentDate <= DateTime.UtcNow)
            return BadRequest("Appointment must be scheduled for a future date and time.");

        var conflict = await _context.Appointments.AnyAsync(a =>
            a.Id != id &&
            a.DoctorId == dto.DoctorId &&
            a.AppointmentDate == dto.AppointmentDate &&
            a.Status == "Scheduled");

        if (conflict)
            return Conflict("The doctor already has an appointment at this time.");

        appointment.PatientId = dto.PatientId;
        appointment.DoctorId = dto.DoctorId;
        appointment.AppointmentDate = dto.AppointmentDate;
        appointment.Reason = dto.Reason.Trim();
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, AppointmentStatusDto dto)
    {
        if (!AllowedStatuses.Contains(dto.Status))
            return BadRequest("Status must be Scheduled, Completed or Cancelled.");

        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        appointment.Status = dto.Status;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment is null) return NotFound();

        var hasMedicalRecord = await _context.MedicalRecords
            .AnyAsync(m => m.AppointmentId == id);

        if (hasMedicalRecord)
            return Conflict("This appointment has a medical record and should not be deleted.");

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
