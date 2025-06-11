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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../entities/post.entity");
const like_entity_1 = require("../entities/like.entity");
const comment_entity_1 = require("../entities/comment.entity");
const user_entity_1 = require("../entities/user.entity");
let PostsService = class PostsService {
    postsRepository;
    likesRepository;
    commentsRepository;
    usersRepository;
    constructor(postsRepository, likesRepository, commentsRepository, usersRepository) {
        this.postsRepository = postsRepository;
        this.likesRepository = likesRepository;
        this.commentsRepository = commentsRepository;
        this.usersRepository = usersRepository;
    }
    async ensureUserExists(walletAddress) {
        const existingUser = await this.usersRepository.findOne({
            where: { walletAddress }
        });
        if (!existingUser) {
            const user = new user_entity_1.User();
            user.walletAddress = walletAddress;
            await this.usersRepository.save(user);
        }
    }
    async create(createPostDto) {
        await this.ensureUserExists(createPostDto.walletAddress);
        const post = this.postsRepository.create(createPostDto);
        return this.postsRepository.save(post);
    }
    async findAll() {
        return this.postsRepository.find({
            relations: ['user', 'likes', 'comments', 'comments.user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['user', 'likes', 'comments', 'comments.user']
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
    async likePost(postId, walletAddress) {
        const post = await this.findOne(postId);
        await this.ensureUserExists(walletAddress);
        const existingLike = await this.likesRepository.findOne({
            where: { postId, walletAddress }
        });
        if (existingLike) {
            await this.likesRepository.remove(existingLike);
        }
        else {
            const like = this.likesRepository.create({ postId, walletAddress });
            await this.likesRepository.save(like);
        }
    }
    async addComment(commentData) {
        const { postId, walletAddress, content } = commentData;
        await this.ensureUserExists(walletAddress);
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const comment = this.commentsRepository.create({
            postId,
            walletAddress,
            content,
        });
        return await this.commentsRepository.save(comment);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map