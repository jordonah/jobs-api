import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseFilters, CacheKey, CacheTTL, CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobDTO } from './dtos/job.dto'
import { Job } from './interfaces/job.interface';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JobData } from '../decorators/jobdata.decorator';
import { BenchmarkInterceptor } from '../interceptors/benchmark.interceptor';

@Controller('jobs')
@UseInterceptors(CacheInterceptor, BenchmarkInterceptor)
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Get(':id')
    @CacheTTL(30)
    find(@Param('id') id): Promise<Job> {
        return this.jobsService.find(id)
                .then((result) => {
                    if(result) {
                        return result;
                    } else {
                        throw new HttpException('Job not found', HttpStatus.NOT_FOUND)
                    }
                })
                .catch(() => {
                    throw new HttpException('Job not found', HttpStatus.NOT_FOUND)
                });
    }
    @Get()
    @CacheKey('allJobs')
    @CacheTTL(15)
    findAll(): Promise<Job[]> {
        return this.jobsService.findAll();
    }

    @Post()
    create(@Body() job: JobDTO): Promise<Job> {
        return this.jobsService.create(job);
    }

    @Put(':id')
    update(@Param('id') id, @Body() job: JobDTO): Promise<Job> {
        return this.jobsService.update(id, job);
    }

    @Delete(':id')
    delete(@Param('id') id): Promise<Job> {
        return this.jobsService.delete(id);
    }

}
