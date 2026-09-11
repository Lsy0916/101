/**
 * 命令面板条目契约（base 纯 UI 层，不含路由等业务语义）。
 * script setup 组件无法直接 export 类型，故独立成文件。
 */
export interface PaletteItem {
  /** 唯一标识（业务层据此回查跳转目标） */
  id: string
  /** 主标题 */
  title: string
  /** 副标题描述 */
  desc?: string
  /** 分组键：按 items 首现顺序展示，显示名经 groupLabels 映射 */
  group: string
  /** 展示编号，如 '01' */
  num?: string
  /** 右侧角标 */
  tag?: string
}
