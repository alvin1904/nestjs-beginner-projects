import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './dto/update-task.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task and return it', () => {
      const dto: CreateTaskDto = {
        title: 'Sample Task',
        description: 'Sample task description',
      };
      const fakeId = 'sdf123';
      const fixedDate = new Date('2023-01-01T00:00:00Z');

      (uuidv4 as jest.Mock).mockReturnValue(fakeId);
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      const res = service.create(dto);

      expect(res).toEqual({
        id: fakeId,
        title: dto.title,
        description: dto.description,
        status: TaskStatus.OPEN,
        createdAt: fixedDate,
      });

      expect(service['tasks']).toContainEqual(res);
    });
  });

  describe('find', () => {
    let service: TaskService;

    beforeEach(() => {
      service = new TaskService();

      // Add mock tasks
      service['tasks'] = [
        {
          id: '1',
          title: 'Learn NestJS',
          description: 'Start with controllers and services',
          status: TaskStatus.OPEN,
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          title: 'Write unit tests',
          description: 'Use Jest to test services',
          status: TaskStatus.IN_PROGRESS,
          createdAt: new Date('2023-01-02'),
        },
        {
          id: '3',
          title: 'Submit project',
          description: 'Final task',
          status: TaskStatus.DONE,
          createdAt: new Date('2023-01-03'),
        },
      ];
    });

    it('should return all tasks when no filter is applied', () => {
      const result = service.findAll({});
      expect(result).toHaveLength(3);
    });

    it('should filter tasks by status', () => {
      const result = service.findAll({ status: TaskStatus.OPEN });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn NestJS');
    });

    it('should filter tasks by search keyword in title or description', () => {
      const result = service.findAll({ search: 'unit' });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Write unit tests');
    });

    it('should filter tasks by both status and search', () => {
      const result = service.findAll({
        status: TaskStatus.DONE,
        search: 'final',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('should return empty array if no tasks match filters', () => {
      const result = service.findAll({
        status: TaskStatus.OPEN,
        search: 'non-existent',
      });

      expect(result).toHaveLength(0);
    });

    it('should return the correct task when a valid ID is provided', () => {
      const result = service.findOne('3');
      expect(result).toBeTruthy();
      expect(result.title).toBe('Submit project');
    });

    it('should throw an exception when an invalid ID is provided', () => {
      expect(() => service.findOne('32')).toThrow('Task Not found');
    });

    it('should update the task when a valid ID and data are provided', () => {
      const updated = service.update('3', {
        title: 'Submit final project',
        description: 'Last step',
        status: TaskStatus.DONE,
      });

      expect(updated.title).toBe('Submit final project');
      expect(updated.description).toBe('Last step');
      expect(updated.status).toBe(TaskStatus.DONE);
    });

    it('should throw an exception when updating a non-existent task', () => {
      expect(() =>
        service.update('99', {
          title: 'Invalid',
          status: TaskStatus.IN_PROGRESS,
        }),
      ).toThrow('Task Not found');
    });

    it('should remove the task when a valid ID is provided', () => {
      const deleted = service.remove('3');
      expect(deleted).toBeTruthy();
      expect(deleted.id).toBe('3');

      // Confirm it’s actually removed
      expect(() => service.findOne('3')).toThrow('Task Not found');
    });

    it('should throw an exception when trying to remove a non-existent task', () => {
      expect(() => service.remove('100')).toThrow('Task not found');
    });
  });
});
