import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput } from './dto/customer.input';
import { Customer, Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async create(params: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({ data: params });
  }

  async get(email: string) {
    return this.prisma.customer.findUnique({
      where: {
        email,
      },
    });
  }

  async remove(email: string) {
    return this.prisma.customer.delete({
      where: {
        email,
      },
    });
  }

  async update(email: string, data: Partial<Customer>) {
    return this.prisma.customer.update({
      where: {
        email,
      },
      data,
    });
  }
}
