using System.Security.Claims;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

// Added by DevOps so the deployed frontend works. Backend authors: review or replace.
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AppointmentsController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = _context.Appointments.AsNoTracking();

        // Patients only see their own appointments.
        if (User.IsInRole("Patient"))
            query = query.Where(a => a.Patient != null && a.Patient.UserId == userId);

        var items = await query
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => new
            {
                id = a.Id,
                patientId = a.PatientId,
                doctorId = a.DoctorId,
                patientName = a.Patient != null ? a.Patient.FirstName + " " + a.Patient.LastName : "",
                doctorName = a.Doctor != null ? a.Doctor.FirstName + " " + a.Doctor.LastName : "",
                appointmentDate = a.AppointmentDate,
                reason = a.Reason,
                status = a.Status
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AppointmentCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var doctor = await _context.Doctors.FindAsync(dto.DoctorId);
        if (doctor is null) return BadRequest("Doctor not found.");

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient is null)
        {
            // Registration does not create a patient profile, so create a minimal one.
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return Unauthorized();

            patient = new Patient
            {
                UserId = userId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = new DateTime(1900, 1, 1),
                Gender = "Unspecified",
                PhoneNumber = string.Empty,
                Address = string.Empty,
                EmergencyContactName = string.Empty,
                EmergencyContactPhone = string.Empty
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
        }

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDate = dto.AppointmentDate,
            Reason = dto.Reason.Trim(),
            Status = "Scheduled"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Created($"api/appointments/{appointment.Id}", new
        {
            id = appointment.Id,
            patientId = appointment.PatientId,
            doctorId = appointment.DoctorId,
            appointmentDate = appointment.AppointmentDate,
            reason = appointment.Reason,
            status = appointment.Status
        });
    }
}