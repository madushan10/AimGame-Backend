const e = require("express");
const { notFoundException } = require("../exception");
const UserModel = require("../models/user");
const WorkspaceUserModel = require("../models/workspaceUser");
const WorkspaceModel = require("../models/workspace");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { SMTP_EMAIL, SMTP_PASSWORD } = require("../../config");
const s3service = require("../services/s3Service");

exports.getTeamMembers = async () => {
  const users = await UserModel.find({
    userRole: "team member",
  });
  return users;
};

exports.createTeamMember = async (user) => {
    const userEmailExists = await UserModel.findOne({
      email: user.email,
    }).exec();
    if (userEmailExists) {
      throw new notFoundException("Email already exists");
    } else {
      const saltRounds = 10;
  
      const hashedPassword = await bcrypt.hash(
        user.password || "",
        Number(saltRounds)
      );
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      if (
        user.image !== null &&
        user.image !== undefined &&
        user.image !== ""
      ) {
        const image = user.image;
        const imageData = await s3service.upload(image, "clients");
        var imagePath = imageData.Location;
      }
      else{
        var imagePath = null;
      }
      user = {
        ...user,
        password: hashedPassword,
        otp,
        otpExpiry: Date.now() + 600000,
        isActive: true,
        image:imagePath
      };
      const newUser = await new UserModel(user).save();
  
    //   const recipientEmail = user?.email;
    //   const subject = "Your OTP Code";
    //   const htmlContent = `
    //                               <html>
    //                                   <body>
    //                                        <h1>Your One-Time Password (OTP)</h1>
    //                                       <p>Your OTP code is: <strong>${otp}</strong></p>
    //                                   </body>
    //                               </html>
    //                           `;
    //   const info = await sendEmail(recipientEmail, subject, htmlContent);
      return Boolean(newUser);
    }
  };

  exports.updateTeamMember = async (id, user) => {
    
    if (
        user.image !== null &&
        user.image !== undefined &&
        user.image !== ""
      ) {
        const image = user.image;
        const imageData = await s3service.upload(image, "clients");
        user.image = imageData.Location;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
  };

  exports.searchTeamMembers = async (searchValue) => {
    const users = await UserModel.find({
      userRole: "team member",
      email: searchValue,
    });
    return users;
  };
  