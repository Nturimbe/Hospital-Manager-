using System.Security.Claims;
using HospitalManagement.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

// Added by DevOps so the deployed frontend works. Backend authors: review or replace.
[ApiController]
[Route("api/medical-records")]
[Authorize]
public class MedicalRecordsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MedicalRecordsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var query = _context.MedicalRecords.AsNoTracking();

        // Patients only see their own records.
        if (User.IsInRole("Patient"))
            query = query.Where(r => r.Patient != null && r.Patient.UserId == userId);

        var items = await query
            .OrderByDescending(r => r.RecordDate)
            .Select(r => new
            {
                id = r.Id,
                patientId = r.PatientId,
                doctorId = r.DoctorId,
                patientName = r.Patient != null ? r.Patient.FirstName + " " + r.Patient.LastName : "",
                doctorName = r.Doctor != null ? r.Doctor.FirstName + " " + r.Doctor.LastName : "",
                symptoms = r.Symptoms,
                diagnosis = r.Diagnosis,
                treatment = r.Treatment,
                prescription = r.Prescription,
                notes = r.Notes,
                createdAt = r.RecordDate
            })
            .ToListAsync();

        return Ok(items);
    }
}