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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(createUserDto, res) {
        try {
            const { name, email, password } = createUserDto;
            console.log(name, email);
            const info = await this.userService.register(name, email, password);
            return res.status(common_1.HttpStatus.OK).json({
                message: name + ", " + info
            });
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({ message: 'Mail not sent' });
        }
    }
    async verifyToken(token, res, req) {
        try {
            const state = await this.userService.verifySignUpToken(token.tok);
            res.status(common_1.HttpStatus.OK).json({
                message: 'Verified Successfully',
                success: true,
                data: state.name
            });
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
                success: false
            });
        }
    }
    async signinUser(data, res, req) {
        console.log("From signin point");
        try {
            const signin = await this.userService.loginUser(data);
            res.status(common_1.HttpStatus.OK).json({
                message: 'Login Information',
                success: true,
                data: signin
            });
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
                success: false
            });
        }
    }
    async forgotPass(data, res, req) {
        console.log("From forgotpass point");
        try {
            const info = await this.userService.forgotPass(data);
            res.status(common_1.HttpStatus.OK).json({
                message: 'Login Information',
                success: true,
                data: info
            });
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
                success: false
            });
        }
    }
    async verifyResetPassToken(data, res, req) {
        try {
            const info = await this.userService.verifyResetPassToken(data);
            res.status(common_1.HttpStatus.OK).json({
                message: 'Password Reseted Successfully',
                success: true,
                data: info
            });
        }
        catch (err) {
            console.error(err);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
                success: false
            });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)(`verify`),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyToken", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateLoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signinUser", null);
__decorate([
    (0, common_1.Post)('forgotpass'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateForgotPassDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPass", null);
__decorate([
    (0, common_1.Post)('verifyresettoken'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyResetPassToken", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map