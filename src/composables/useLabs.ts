import { useRequest } from 'vue-request'
import {
  createBooking,
  getComputerLabs,
  getSeatsStatusByTime,
} from '@/api/modules/lab'
import type { ComputerLab, CreateBookingParams, Seat } from '@/api/modules/lab'

/**
 * 机房预约 composables（vue-request 桥接样板：列表查询类）。
 * 阶段 5 迁移机房预约视图时按需扩展（详情/取消/改状态等入口已在 server 层）。
 */

/** 机房列表（自动执行） */
export function useComputerLabs() {
  const { data, loading, error, run } = useRequest<ComputerLab[]>(getComputerLabs, {
    initialData: [],
  })

  return { labs: data, loading, error, reload: run }
}

/** 座位状态查询（manual：由日期/时段选择触发） */
export function useSeatsStatus() {
  const { data, loading, error, run } = useRequest<
    Seat[],
    [{ roomId: number; date: string; startTime: string; endTime: string }]
  >((params) => getSeatsStatusByTime(params), {
    manual: true,
    initialData: [],
  })

  return { seats: data, loading, error, query: run }
}

/** 创建预约（manual） */
export function useCreateBooking() {
  const { run, loading, error } = useRequest<void, [CreateBookingParams]>(
    (params) => createBooking(params),
    { manual: true },
  )

  return { run, loading, error }
}
