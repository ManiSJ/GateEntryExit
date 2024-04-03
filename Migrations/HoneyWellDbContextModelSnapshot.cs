﻿// <auto-generated />
using System;
using GateEntryExit.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GateEntryExit.Migrations
{
    [DbContext(typeof(GateEntryExitDbContext))]
    partial class GateEntryExitDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.17")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GateEntryExit.Domain.Gate", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Gates");
                });

            modelBuilder.Entity("GateEntryExit.Domain.GateEntry", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("GateId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("NumberOfPeople")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeStamp")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("GateId");

                    b.ToTable("GateEntries");
                });

            modelBuilder.Entity("GateEntryExit.Domain.GateExit", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("GateId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("NumberOfPeople")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeStamp")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("GateId");

                    b.ToTable("GateExits");
                });

            modelBuilder.Entity("GateEntryExit.Domain.Sensor", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("GateId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("GateId")
                        .IsUnique();

                    b.ToTable("Sensors");
                });

            modelBuilder.Entity("GateEntryExit.Domain.GateEntry", b =>
                {
                    b.HasOne("GateEntryExit.Domain.Gate", "Gate")
                        .WithMany("GateEntries")
                        .HasForeignKey("GateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gate");
                });

            modelBuilder.Entity("GateEntryExit.Domain.GateExit", b =>
                {
                    b.HasOne("GateEntryExit.Domain.Gate", "Gate")
                        .WithMany("GateExits")
                        .HasForeignKey("GateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gate");
                });

            modelBuilder.Entity("GateEntryExit.Domain.Sensor", b =>
                {
                    b.HasOne("GateEntryExit.Domain.Gate", "Gate")
                        .WithOne("Sensor")
                        .HasForeignKey("GateEntryExit.Domain.Sensor", "GateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gate");
                });

            modelBuilder.Entity("GateEntryExit.Domain.Gate", b =>
                {
                    b.Navigation("GateEntries");

                    b.Navigation("GateExits");

                    b.Navigation("Sensor")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
