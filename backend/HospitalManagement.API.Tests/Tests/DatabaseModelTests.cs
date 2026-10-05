using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Tests;

public class DatabaseModelTests
{
    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Patient_CanBeSavedAndRetrieved()
    {
        await using var context = CreateContext();

        context.Patients.Add(new Patient
        {
            FirstName = "Ama",
            LastName = "Mensah",
            DateOfBirth = new DateTime(2000, 1, 1),
            Gender = "Female",
            PhoneNumber = "0000000000"
        });

        await context.SaveChangesAsync();

        var patient = await context.Patients.SingleAsync();

        Assert.Equal("Ama", patient.FirstName);
        Assert.Equal("Mensah", patient.LastName);
    }

    [Fact]
    public async Task Appointment_LinksPatientAndDoctor()
    {
        await using var context = CreateContext();

        var patient = new Patient
        {
            FirstName = "Test",
            LastName = "Patient",
            DateOfBirth = new DateTime(2000, 1, 1),
            Gender = "Other"
        };

        var doctor = new Doctor
        {
            FirstName = "Test",
            LastName = "Doctor",
            Specialization = "General Medicine",
            LicenseNumber = "TEST-001"
        };

        context.Patients.Add(patient);
        context.Doctors.Add(doctor);
        await context.SaveChangesAsync();

        context.Appointments.Add(new Appointment
        {
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            AppointmentDate = DateTime.UtcNow.AddDays(1),
            Reason = "Test appointment",
            Status = "Scheduled"
        });

        await context.SaveChangesAsync();

        var appointment = await context.Appointments.SingleAsync();

        Assert.Equal(patient.Id, appointment.PatientId);
        Assert.Equal(doctor.Id, appointment.DoctorId);
        Assert.Equal("Scheduled", appointment.Status);
    }
}
