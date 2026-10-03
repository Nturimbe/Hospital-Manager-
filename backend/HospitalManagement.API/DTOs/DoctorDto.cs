using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs;

public class DoctorDto
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Specialization { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string LicenseNumber { get; set; } = string.Empty;

    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;
}
