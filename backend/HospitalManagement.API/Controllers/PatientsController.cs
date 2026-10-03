using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PatientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetAll()
    {
        return Ok(await _context.Patients
            .AsNoTracking()
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Patient>> GetById(int id)
    {
        var patient = await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return patient is null ? NotFound() : Ok(patient);
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> Create(PatientDto dto)
    {
        var patient = new Patient
        {
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            Address = dto.Address.Trim(),
            EmergencyContactName = dto.EmergencyContactName.Trim(),
            EmergencyContactPhone = dto.EmergencyContactPhone.Trim()
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, PatientDto dto)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient is null) return NotFound();

        patient.FirstName = dto.FirstName.Trim();
        patient.LastName = dto.LastName.Trim();
        patient.DateOfBirth = dto.DateOfBirth;
        patient.Gender = dto.Gender.Trim();
        patient.PhoneNumber = dto.PhoneNumber.Trim();
        patient.Address = dto.Address.Trim();
        patient.EmergencyContactName = dto.EmergencyContactName.Trim();
        patient.EmergencyContactPhone = dto.EmergencyContactPhone.Trim();

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient is null) return NotFound();

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
