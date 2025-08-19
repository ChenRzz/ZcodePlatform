import instance from "../utils/axios";
import type { JoinClassroomResponse, ClassroomState } from "../types/classroom";

export interface JoinClassroomRequest {
    lecture_id: number;
    zcode: string;
}
export interface ExecutionResult {
    id: string;
    lecture_id: number;
    user_zcode: string;
    code: string;
    language: string;
    output: string;
    error?: string;
    exit_code: number;
    duration_ms: number;
    executed_at: string;
    status: 'running' | 'completed' | 'failed' | 'timeout';
}


export const classroomService = {
    async joinClassroom(
        lectureId: number,
        zcode: string,
        lecturerZcode: string,
        name: string | null,
        lectureName?:string,
    ): Promise<JoinClassroomResponse> {
        try {
            const response = await instance.post('/api/classroom/join', {
                lecture_id: lectureId,
                zcode: zcode,
                lecturer_zcode: lecturerZcode,
                name: name || zcode,
                lecture_name:lectureName,
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Failed to join classroom');
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Network error');
        }
    },

    async getClassroomState(lectureId: number, zcode: string): Promise<ClassroomState> {
        try {
            const response = await instance.get(`/api/classroom/${lectureId}/state`, {
                params: { zcode }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Failed to get classroom status');
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Network error');
        }
    },


    async executeCode(
        lectureId: number,
        userZcode: string,
        code: string,
        userRole: 'teacher' | 'student'
    ): Promise<ExecutionResult> {
        try {
            const response = await instance.post('/api/execution/execute', {
                lecture_id: lectureId,
                user_zcode: userZcode,
                code: code,
                language: 'python',
                document_key: userRole === 'teacher' ? 'teacher-code' : `student-${userZcode}`
            }, {
                params: { role: userRole }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Code execution failed');
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Failed to execute code');
        }
    },
};