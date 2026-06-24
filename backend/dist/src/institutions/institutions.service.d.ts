import { PrismaService } from '../prisma/prisma.service';
export declare class InstitutionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        type?: string;
        settings?: any;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    update(id: string, data: {
        name?: string;
        type?: string;
        status?: string;
        settings?: any;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        status: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
