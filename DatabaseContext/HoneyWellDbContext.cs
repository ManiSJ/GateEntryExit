﻿using GateEntryExit.Domain;
using Microsoft.EntityFrameworkCore;

namespace GateEntryExit.DatabaseContext
{
    public class GateEntryExitDbContext : DbContext
    {
        public GateEntryExitDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<GateEntry> GateEntries { get; set; }

        public DbSet<GateExit> GateExits { get; set; }

        public DbSet<Sensor> Sensors { get; set; }

        public DbSet<Gate> Gates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Gate>(entity =>
            {
                entity.Property(g => g.Name).IsRequired().HasMaxLength(50);

                entity.HasIndex(e => e.Name).IsUnique();

                entity.HasKey(g => g.Id);

                entity.HasMany(g => g.GateEntries)
                  .WithOne(ge => ge.Gate)
                  .HasForeignKey(ge => ge.GateId);

                entity.HasMany(g => g.GateExits)
                  .WithOne(ge => ge.Gate)
                  .HasForeignKey(ge => ge.GateId);
            });

            modelBuilder.Entity<GateEntry>(entity =>
            {
                entity.HasKey(g => g.Id);
            });

            modelBuilder.Entity<GateExit>(entity =>
            {
                entity.HasKey(g => g.Id);
            });

            modelBuilder.Entity<Sensor>(entity =>
            {
                entity.Property(g => g.Name).IsRequired().HasMaxLength(50);

                entity.HasKey(g => g.Id);

                entity.HasOne(s => s.Gate);
            });
        }
    }
}
