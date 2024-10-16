import { Injectable } from '@nestjs/common';
import { CreateForgotPassDto, CreateLoginDto, CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
 

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Register the user and send email verification link
  async register(name: string, email: string, password:string)
  {
    const existingUser = await this.userRepository.findOne({ where: { email } });
     
    let token:string='';
    if(!existingUser){
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const newUser =  this.userRepository.create({ name, email, password, token});
      console.log(newUser);
      await this.userRepository.save(newUser);
      tokenGenAndMailsend();
      return "Check your mail to verfiy yourself";

    }
    else{

      if(existingUser.isVerified===false){
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await this.userRepository.update({email},{name, password, token});
        tokenGenAndMailsend();
        return "Your email was already registered, now you have to verify yourself by clicking the link which is sent to your mail";
        }
        else
        {
          return "you are already a registered user, don't try to register again";
        }
      }
  
      async function tokenGenAndMailsend(){
        const verificationLink = `http://localhost:4200/registration/signin?token=${token}`;
        const transporter = await nodemailer.createTransport({
          service: 'Gmail',
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: 'elaishamothi@gmail.com',
            pass: 'jrbu vlho hxzp zfkm',
          },
        });
    
        const mailOptions = {
          from: 'elaishamothi@gmail.com',
          to: email,
          subject: 'Verify your email',
          html: `<p>Hi ${name},</p><p>Please click the following link to verify your email: </p><a href="${verificationLink}">Verify Email</a>`,
        };
    
        await transporter.sendMail(mailOptions, (error: any, info: { response: string; })=>{
          if(error){
            console.log('Email sending failed:', error);
          }
          else{
            console.log('Email sent: '+info.response);
          }
        });
      }
  }

  // Verify the token and allow the user to set a password
  async verifySignUpToken(token: string){
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
      console.log(decoded.email)

      const user = await this.userRepository.findOne({ where: { email: decoded.email } });

      if (!user) throw new Error('User not found');
      if (user.isVerified) throw new Error('User already verified');

      user.isVerified = true;
      user.token = null;
      return await this.userRepository.save(user);
       
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async verifyResetPassToken(data:any){
    try {
      const decoded = jwt.verify(data.tok, process.env.JWT_SECRET) as { email: string };
      console.log(decoded.email)

      const user = await this.userRepository.findOne({ where: { email: decoded.email } });

      if (!user) throw new Error('User not found');

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(data.password, salt);
      return await this.userRepository.save(user);
       
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async loginUser(data:CreateLoginDto){
    let email = data.email;
    let password = data.password;
    console.log(email, password);

    const existingUser = await this.userRepository.findOne({where:{email}})
    if(!existingUser){
      return {val:'You are not a registered user. Please register yourself', login:false};
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if(isPasswordValid && existingUser.isVerified===false)
    {
      existingUser.attempt = existingUser.attempt++;
      return {val:"Verify Yourself", login:false}
    }
    else if(!isPasswordValid || email!==existingUser.email){
      return {val:"Invalid username or password", login:false};
    }
    else
    {
      const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return {val:token, login:true};
    }
  }


  async forgotPass(data:CreateForgotPassDto){
    const email = data.email;
    const existingUser = await this.userRepository.findOne({where:{email}})
    if(!existingUser){
      return {val:'You are not a registered user. Please register yourself'};
    }
    else if(existingUser.isVerified===false){
      return {val:"You are not a verified user, go and verify yourself in signup option"}
    }
    else{
      const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const verificationLink = ` http://localhost:4200/registration/resetpass?token=${token}`;
      const transporter = await nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.MAILTRAP_USER,
        to: email,
        subject: 'Verify your email',
        html: `<p>Hi ${existingUser.name},</p><p>Please click the following link to reset your password: </p><a href="${verificationLink}">Reset Password</a>`,
      };
  
      await transporter.sendMail(mailOptions, (error: any, info: { response: string; })=>{
        if(error){
          console.log('Email sending failed:', error);
        }
        else{
          console.log('Email sent: '+info.response);
        }
      });
      return "Check your email to reset password";
    }
  }

}
