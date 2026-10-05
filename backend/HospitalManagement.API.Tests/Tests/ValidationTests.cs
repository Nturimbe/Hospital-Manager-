using System.ComponentModel.DataAnnotations;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Tests;

public class ValidationTests
{
    private static List<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(model);

        Validator.TryValidateObject(
            model,
            context,
            results,
            validateAllProperties: true);

        return results;
    }

    [Fact]
    public void LoginDto_InvalidEmail_FailsValidation()
    {
        var dto = new LoginDto
        {
            Email = "not-an-email",
            Password = "Password1!"
        };

        Assert.NotEmpty(Validate(dto));
    }

    [Fact]
    public void RegisterDto_ShortPassword_FailsValidation()
    {
        var dto = new RegisterDto
        {
            FirstName = "Test",
            LastName = "Patient",
            Email = "patient@test.com",
            Password = "123"
        };

        Assert.NotEmpty(Validate(dto));
    }

    [Fact]
    public void PatientDto_MissingRequiredFields_FailsValidation()
    {
        var dto = new PatientDto();

        Assert.NotEmpty(Validate(dto));
    }

    [Fact]
    public void AppointmentDto_MissingReason_FailsValidation()
    {
        var dto = new AppointmentDto
        {
            PatientId = 1,
            DoctorId = 1,
            AppointmentDate = DateTime.UtcNow.AddDays(1),
            Reason = ""
        };

        Assert.NotEmpty(Validate(dto));
    }

    [Fact]
    public void MedicalRecordDto_MissingDiagnosis_FailsValidation()
    {
        var dto = new MedicalRecordDto
        {
            PatientId = 1,
            DoctorId = 1,
            Diagnosis = ""
        };

        Assert.NotEmpty(Validate(dto));
    }
}
