import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserRole } from 'src/common/enums/user-role';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateArticleFileDto } from './dto/create-article-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import path from "path" 
import { Article } from './entities/article.entity';

@ApiBearerAuth("JWT-auth")
@UseGuards(AuthGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  
  @ApiOkResponse({type: CreateArticleDto})
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes("multipart/form-data")
  @ApiBody({type: CreateArticleFileDto})
  @Post("create_articles")
  @UseInterceptors(
    FileInterceptor("backgroundImage", {
      storage: diskStorage ({
      destination: path.join(process.cwd(), "uploads"),
      filename: (req, file, cb) => {
        const uniqueSufix = `${file.filename}${Date.now()}`
        const ext = path.extname(file.originalname)
        cb(null, `${uniqueSufix}${ext}`)
      }
      })
    })
  )
  create(@Body() createArticleDto: CreateArticleDto, file: Express.Multer.File) {
    return this.articlesService.create(createArticleDto, file);
  }

  @ApiOkResponse({type: CreateArticleDto})
  @HttpCode(200)
  @Get("get_all_articles")
  findAll() {
    return this.articlesService.findAll();
  }

  @ApiNotFoundResponse({description: "Article not found"})
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiNotFoundResponse({description: "Article not found"})
  @ApiOkResponse({description: "Updated article"})
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiNotFoundResponse({description: "Article not found"})
  @ApiOkResponse({description: "Deleted article"})
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
