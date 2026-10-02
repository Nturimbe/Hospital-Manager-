using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models;

public class Doctor
{
    public int Id { get; set; }
    public string? UserId { get; set; }

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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser? User { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
        = new List<Appointment>();

    public ICollection<MedicalRecord> MedicalRecords { get; set; }
        = new List<MedicalRecord>();
}