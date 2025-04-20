﻿using Ecom.Core.DTO;
using Ecom.Core.Entities;
using Ecom.Core.interfaces;
using Ecom.Core.Services;
using Ecom.Core.Sharing;
using Ecom.infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ecom.infrastructure.Repositries
{
    public class AuthRepositry : IAuth
    {
        private readonly UserManager<AppUser> userManager;
        private readonly IEmailService emailService;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IGenerateToken generateToken;
        private readonly AppDbContext context;
        public AuthRepositry(UserManager<AppUser> userManager, IEmailService emailService, SignInManager<AppUser> signInManager, IGenerateToken generateToken, AppDbContext context)
        {
            this.userManager = userManager;
            this.emailService = emailService;
            this.signInManager = signInManager;
            this.generateToken = generateToken;
            this.context = context;
        }
        public async Task<string> RegisterAsync(RegisterDTO registerDTO)
        {
            if (registerDTO == null)
            {
                return null;
            }
            if (await userManager.FindByNameAsync(registerDTO.UserName) is not null)
            {
                return "this UserName is already registerd";
            }
            if (await userManager.FindByEmailAsync(registerDTO.Email) is not null)
            {
                return "this email is already registerd";
            }

            AppUser user = new()
            {
                Email = registerDTO.Email,
                UserName = registerDTO.UserName,
                DispalyName = registerDTO.DisplayName,
            };

            var result = await userManager.CreateAsync(user, registerDTO.Password);
            if (result.Succeeded is not true)
            {
                return result.Errors.ToList()[0].Description;
            }
            // Send Active Email
            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
            await SendEmail(user.Email, token, "active", "ActiveEmail", "Please active your email, click on button to active");
            return "done";
        }
        //public async Task<string> RegisterAsync(RegisterDTO registerDTO)
        //{
        //    try
        //    {
        //        // التحقق من البيانات المدخلة
        //        if (registerDTO == null)
        //            return "Invalid registration data";

        //        // التحقق من اسم المستخدم
        //        if (await userManager.FindByNameAsync(registerDTO.UserName) != null)
        //            return "this UserName is already registerd";

        //        // التحقق من البريد الإلكتروني
        //        if (await userManager.FindByEmailAsync(registerDTO.Email) != null)
        //            return "this email is already registerd";

        //        // إنشاء مستخدم جديد
        //        var user = new AppUser
        //        {
        //            Email = registerDTO.Email,
        //            UserName = registerDTO.UserName,
        //            DispalyName = registerDTO.DisplayName
        //        };

        //        // محاولة الحفظ
        //        var result = await userManager.CreateAsync(user, registerDTO.Password);

        //        if (!result.Succeeded)
        //            return result.Errors.FirstOrDefault()?.Description ?? "Registration failed";

        //        // إرسال بريد التفعيل - مع معالجة الأخطاء بشكل أفضل
        //        try
        //        {
        //            string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        //            await SendEmail(user.Email, token, "active", "Activate Account",
        //                "Please confirm your email by clicking the link");

        //            return "done";
        //        }
        //        catch (Exception ex)
        //        {
        //            // تسجيل الخطأ دون التأثير على تجربة المستخدم

        //            return "done_but_email_failed"; // حالة خاصة
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //        return "Registration failed due to unexpected error";
        //    }
        //}
        public async Task SendEmail(string email, string code, string component, string subject, string message)
        {
            var result = new EmailDTO(email,
                "islamayman952htk1ta2@gmail.com",
                subject
                , EmailStringBody.send(email, code, component, message));
            await emailService.SendEmail(result);
        }




        public async Task<string> LoginAsync(LoginDTO login)
        {
            if (login == null)
            {
                return null;
            }
            var finduser = await userManager.FindByEmailAsync(login.Email);

            if (!finduser.EmailConfirmed)
            {
                string token = await userManager.GenerateEmailConfirmationTokenAsync(finduser);

                await SendEmail(finduser.Email, token, "active", "ActiveEmail", "Please active your email, click on button to active");

                return "Please confirem your email first, we have send activat to your E-mail";
            }

            var result = await signInManager.CheckPasswordSignInAsync(finduser, login.Password, true);

            if (result.Succeeded)
            {
                return generateToken.GetAndCreateToken(finduser);
            }

            return "please check your email and password, something went wrong";
        }





        public async Task<bool> SendEmailForForgetPassword(string email)
        {
            var findUser = await userManager.FindByEmailAsync(email);
            if (findUser is null)
            {
                return false;
            }
            var token = await userManager.GeneratePasswordResetTokenAsync(findUser);
            await SendEmail(findUser.Email, token, "Reset-Password", "Rest pssword", "click on button to Reset your password");

            return true;

        }

        public async Task<string> ResetPassword(RestPasswordDTO restPassword)
        {
            var findUser = await userManager.FindByEmailAsync(restPassword.Email);
            if (findUser is null)
            {
                return null;
            }

            var result = await userManager.ResetPasswordAsync(findUser, restPassword.Token, restPassword.Password);

            if (result.Succeeded)
            {
                return "done";
            }
            return result.Errors.ToList()[0].Description;
        }
        public async Task<bool> ActiveAccount(ActiveAccountDTO accountDTO)
        {
            var findUser = await userManager.FindByEmailAsync(accountDTO.Email);
            if (findUser is null)
            {
                return false;
            }

            var reslt = await userManager.ConfirmEmailAsync(findUser, accountDTO.Token);
            if (reslt.Succeeded)
                return true;

            var token = await userManager.GenerateEmailConfirmationTokenAsync(findUser);
            await SendEmail(findUser.Email, token, "active", "ActiveEmail", "Please active your email, click on button to active");

            return false;
        }


        public async Task<bool> UpdateAddress(string email, Address address)
        {
            var findUser = await userManager.FindByEmailAsync(email);
            if (findUser is null)
            {
                return false;
            }
            var Myaddress = await context.Addresses.AsNoTracking()
                .FirstOrDefaultAsync(m => m.AppUserId == findUser.Id);

            if (Myaddress is null)
            {
                address.AppUserId = findUser.Id;
                await context.Addresses.AddAsync(address);
            }
            else
            {
                context.Entry(Myaddress).State = EntityState.Detached;
                address.Id = Myaddress.Id;
                address.AppUserId = Myaddress.AppUserId;
                context.Addresses.Update(address);

            }
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Address> getUserAddress(string email)
        {
            var User = await userManager.FindByEmailAsync(email);
            var address = await context.Addresses.FirstOrDefaultAsync(m => m.AppUserId == User.Id);

            return address;
        }
    }
}
