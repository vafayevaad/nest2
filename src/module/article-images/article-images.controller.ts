import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ArticleImagesService } from './article-images.service';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role';

@ApiBearerAuth('JWT-auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(AuthGuard)
@Controller('article-images')
export class ArticleImagesController {
  constructor(private readonly articleImagesService: ArticleImagesService) {}

  @ApiOkResponse({ type: CreateArticleImageDto, isArray: true })
  //@UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleId: { type: 'number' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @HttpCode(201)
  @Post('create_article')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${file.fieldname}${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createArticleImageDto: CreateArticleImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.articleImagesService.create(createArticleImageDto, files);
  }

  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.articleImagesService.findAll(query);
  }
}