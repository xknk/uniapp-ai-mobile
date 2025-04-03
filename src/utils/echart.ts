/*
 * @Author: Robin LEI
 * @Date: 2025-03-24 09:06:17
 * @LastEditTime: 2025-04-03 11:38:59
 * @FilePath: \uniapp\插件模板\前端页面模板\uniapp-ai-mobile\src\utils\echart.ts
 */
import * as echarts from 'echarts/core';
import {
    BarChart,
    LineChart,
    PieChart
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    // 数据集组件
    DatasetComponent,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent,
    ToolboxComponent,
    DataZoomComponent
     
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    ToolboxComponent,
    DataZoomComponent
]);
export default echarts;
