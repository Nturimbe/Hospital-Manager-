using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalRecordsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MedicalRecordsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetAll()
    {
        var records = await _context.MedicalRecords
            .AsNoTracking()
            .Include(m => m.Patient)
            .Include(m => m.Doctor)
            .OrderByDescending(m => m.RecordDate)
            .ToListAsync();

        return Ok(records);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MedicalRecord>> GetById(int id)
    {
        var record = await _context.MedicalRecords
            .AsNoTracking()
            .Include(m => m.Patient)
            .Include(m => m.Doctor)
            .Include(m => m.Appointment)
            .FirstOrDefaultAsync(m => m.Id == id);

        return record is null ? NotFound() : Ok(record);
    }

    [HttpGet("patient/{patientId:int}")]
    public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetForPatient(int patientId)
    {
        if (!await _context.Patients.AnyAsync(p => p.Id == patientId))
            return NotFound("Patient not found.");

        var records = await _context.MedicalRecords
            .AsNoTracking()
            .Include(m => m.Doctor)
            .Where(m => m.PatientId == patientId)
            .OrderByDescending(m => m.RecordDate)
            .ToListAsync();

        return Ok(records);
    }

    
    [HttpPost]
    public async Task<ActionResult<MedicalRecord>> Create(MedicalRecordDto dto)
    {
        if (!await _context.Patients.AnyAsync(p => p.Id == dto.PatientId))
            return BadRequest("Patient does not exist.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId))
            return BadRequest("Doctor does not exist.");

        Appointment? appointment = null;

        if (dto.AppointmentId.HasValue)
        {
            appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId.Value);

            if (appointment is null)
                return BadRequest("Appointment does not exist.");

            if (appointment.PatientId != dto.PatientId ||
                appointment.DoctorId != dto.DoctorId)
                return BadRequest(
                    "The appointment does not belong to the selected patient and doctor.");
        }

        var record = new MedicalRecord
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentId = dto.AppointmentId,
            Symptoms = dto.Symptoms.Trim(),
            Diagnosis = dto.Diagnosis.Trim(),
            Treatment = dto.Treatment.Trim(),
            Prescription = dto.Prescription.Trim(),
            Notes = dto.Notes.Trim()
        };

        _context.MedicalRecords.Add(record);

        if (appointment is not null)
        {
            appointment.Status = "Completed";
            appointment.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = record.Id }, record);
    }

    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, MedicalRecordDto dto)
    {
        var record = await _context.MedicalRecords.FindAsync(id);
        if (record is null) return NotFound();

        if (!await _context.Patients.AnyAsync(p => p.Id == dto.PatientId))
            return BadRequest("Patient does not exist.");

        if (!await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId))
            return BadRequest("Doctor does not exist.");

        if (dto.AppointmentId.HasValue)
        {
            var appointment = await _context.Appointments
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId.Value);

            if (appointment is null)
                return BadRequest("Appointment does not exist.");

            if (appointment.PatientId != dto.PatientId ||
                appointment.DoctorId != dto.DoctorId)
                return BadRequest(
                    "The appointment does not belong to the selected patient and doctor.");
        }

        record.PatientId = dto.PatientId;
        record.DoctorId = dto.DoctorId;
        record.AppointmentId = dto.AppointmentId;
        record.Symptoms = dto.Symptoms.Trim();
        record.Diagnosis = dto.Diagnosis.Trim();
        record.Treatment = dto.Treatment.Trim();
        record.Prescription = dto.Prescription.Trim();
        record.Notes = dto.Notes.Trim();
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}