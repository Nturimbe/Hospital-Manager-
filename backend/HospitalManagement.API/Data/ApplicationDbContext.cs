using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

  public DbSet<Patient> Patients { get; set; }
public DbSet<Doctor> Doctors { get; set; }
public DbSet<Appointment> Appointments { get; set; }
public DbSet<MedicalRecord> MedicalRecords { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Patient>()
            .HasOne(p => p.User)
            .WithOne()
            .HasForeignKey<Patient>(p => p.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Doctor>()
            .HasOne(d => d.User)
            .WithOne()
            .HasForeignKey<Doctor>(d => d.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Doctor>()
            .HasIndex(d => d.LicenseNumber)
            .IsUnique();

        builder.Entity<Patient>()
            .HasIndex(p => p.UserId)
            .IsUnique();

        builder.Entity<Doctor>()
            .HasIndex(d => d.UserId)
            .IsUnique();
        builder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Appointment>()
            .HasOne(a => a.Doctor)
            .WithMany(d => d.Appointments)
            .HasForeignKey(a => a.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MedicalRecord>()
                 .HasOne(m => m.Patient)
            .WithMany(p => p.MedicalRecords)
            .HasForeignKey(m => m.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MedicalRecord>()
            .HasOne(m => m.Doctor)
            .WithMany(d => d.MedicalRecords)
            .HasForeignKey(m => m.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<MedicalRecord>()
            .HasOne(m => m.Appointment)
            .WithMany()
            .HasForeignKey(m => m.AppointmentId)
            .OnDelete(DeleteBehavior.SetNull); 
        builder.Entity<Appointment>()
            .HasIndex(a => a.AppointmentDate);

        builder.Entity<Appointment>()
            .HasIndex(a => new { a.DoctorId, a.AppointmentDate });

        builder.Entity<MedicalRecord>()
            .HasIndex(m => m.RecordDate);

        builder.Entity<MedicalRecord>()
            .HasIndex(m => m.PatientId);   }
}