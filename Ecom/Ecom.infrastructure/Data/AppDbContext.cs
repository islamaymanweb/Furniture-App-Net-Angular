﻿using Ecom.Core.Entities;
using Ecom.Core.Entities.Order;
using Ecom.Core.Entities.Product;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Ecom.infrastructure.Data
{
    public class AppDbContext: IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext>options):base (options)
        {
            
        }
        public DbSet<Category> Categories { get; set; } 
        public DbSet<Product> Products { get; set; }    
        public DbSet<Photo> Photos { get; set; }
        public  DbSet<Address> Addresses { get; set; }
        public virtual DbSet<Orders> Orders { get; set; }
        public virtual DbSet<OrderItem> OrderItems { get; set; }
        //public virtual DbSet<Rating> Ratings { get; set; }
        public virtual DbSet<DeliveryMethod> DeliveryMethods { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
      
        }


    }
}
