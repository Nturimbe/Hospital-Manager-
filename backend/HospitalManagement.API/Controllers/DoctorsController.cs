using Microsoft.AspNetCore.Authorization;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DoctorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetAll()
    {
        return Ok(await _context.Doctors
            .AsNoTracking()
            .OrderBy(d => d.LastName)
            .ThenBy(d => d.FirstName)
            .ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Doctor>> GetById(int id)
    {
        var doctor = await _context.Doctors
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        return doctor is null ? NotFound() : Ok(doctor);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Doctor>> Create(DoctorDto dto)
    {
        if (await _context.Doctors.AnyAsync(d => d.LicenseNumber == dto.LicenseNumber))
            return Conflict("A doctor with this license number already exists.");

        var doctor = new Doctor
        {
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Specialization = dto.Specialization.Trim(),
            LicenseNumber = dto.LicenseNumber.Trim(),
            PhoneNumber = dto.PhoneNumber.Trim(),
            Department = dto.Department.Trim()
        };

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, doctor);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, DoctorDto dto)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();

        var duplicateLicense = await _context.Doctors
            .AnyAsync(d => d.Id != id && d.LicenseNumber == dto.LicenseNumber);
        if (duplicateLicense)
            return Conflict("A doctor with this license number already exists.");

        doctor.FirstName = dto.FirstName.Trim();
        doctor.LastName = dto.LastName.Trim();
        doctor.Specialization = dto.Specialization.Trim();
        doctor.LicenseNumber = dto.LicenseNumber.Trim();
        doctor.PhoneNumber = dto.PhoneNumber.Trim();
        doctor.Department = dto.Department.Trim();

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor is null) return NotFound();

        _context.Doctors.Remove(doctor);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
