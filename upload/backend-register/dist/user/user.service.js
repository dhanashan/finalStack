"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(name, email, password) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        let token = '';
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const newUser = this.userRepository.create({ name, email, password, token });
            console.log(newUser);
            await this.userRepository.save(newUser);
            tokenGenAndMailsend();
            return "Check your mail to verfiy yourself";
        }
        else {
            if (existingUser.isVerified === false) {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
                token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                await this.userRepository.update({ email }, { name, password, token });
                tokenGenAndMailsend();
                return "Your email was already registered, now you have to verify yourself by clicking the link which is sent to your mail";
            }
            else {
                return "you are already a registered user, don't try to register again";
            }
        }
        async function tokenGenAndMailsend() {
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
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Email sending failed:', error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
    async verifySignUpToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded.email);
            const user = await this.userRepository.findOne({ where: { email: decoded.email } });
            if (!user)
                throw new Error('User not found');
            if (user.isVerified)
                throw new Error('User already verified');
            user.isVerified = true;
            user.token = null;
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async verifyResetPassToken(data) {
        try {
            const decoded = jwt.verify(data.tok, process.env.JWT_SECRET);
            console.log(decoded.email);
            const user = await this.userRepository.findOne({ where: { email: decoded.email } });
            if (!user)
                throw new Error('User not found');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(data.password, salt);
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async loginUser(data) {
        let email = data.email;
        let password = data.password;
        console.log(email, password);
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (!existingUser) {
            return { val: 'You are not a registered user. Please register yourself', login: false };
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid && existingUser.isVerified === false) {
            existingUser.attempt = existingUser.attempt++;
            return { val: "Verify Yourself", login: false };
        }
        else if (!isPasswordValid || email !== existingUser.email) {
            return { val: "Invalid username or password", login: false };
        }
        else {
            const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { val: token, login: true };
        }
    }
    async forgotPass(data) {
        const email = data.email;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (!existingUser) {
            return { val: 'You are not a registered user. Please register yourself' };
        }
        else if (existingUser.isVerified === false) {
            return { val: "You are not a verified user, go and verify yourself in signup option" };
        }
        else {
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
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Email sending failed:', error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return "Check your email to reset password";
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map