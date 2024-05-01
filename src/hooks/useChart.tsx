import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDateGetDayNumber, formatDateGetMonthNumber } from '@/utils/date';
import { FormattedAppointmentData } from '@/lib/schemas';
import { formatToCurrency } from '@/utils/number';
import { useState } from 'react';

export const useChart = (data: FormattedAppointmentData[]) => {
  type ChartData = typeof chartData;
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const activeMonthDaysCount = new Date(new Date().getFullYear(), activeMonth + 1, 0).getUTCDate();

  const updateActiveMonth = (action: 'increment' | 'decrement') => {
    setActiveMonth((prev) => {
      return action === 'increment' ? (prev >= 11 ? 0 : (prev += 1)) : prev <= 0 ? 11 : (prev -= 1);
    });
  };

  const currentMonthTotalRevenue = data.reduce(
    (monthTotalRevenue, { appointmentDate, appointmentStatus, haircutPrice }) => {
      if (appointmentStatus === 'Pago' && new Date(appointmentDate).getMonth() === activeMonth) {
        monthTotalRevenue += haircutPrice;
      }
      return monthTotalRevenue;
    },
    0,
  );

  const chartData = Array.from({ length: activeMonthDaysCount })
    .map((_, index) => index + 1)
    .map((monthDay) => {
      const currentMonthDay = String(new Date(new Date().getFullYear(), activeMonth, monthDay));

      const totalRevenue = data
        .filter(({ appointmentDate, appointmentStatus }) => {
          return (
            appointmentStatus === 'Pago' &&
            new Date(appointmentDate).getDate() == monthDay &&
            new Date(appointmentDate).getMonth() === activeMonth
          );
        })
        .reduce((totalRevenue, { haircutPrice }) => {
          totalRevenue += haircutPrice;
          return totalRevenue;
        }, 0);

      return {
        dayTotalRevenue: totalRevenue,
        monthDay: `${formatDateGetDayNumber(currentMonthDay)}/${formatDateGetMonthNumber(currentMonthDay)}`,
      };
    });

  const getLineChartLeftMargin = (chartData: ChartData) => {
    const MARGIN_MULTIPLIER = 12.5;
    return (
      String(Math.max(...chartData.map(({ dayTotalRevenue }) => dayTotalRevenue))).length * MARGIN_MULTIPLIER
    );
  };

  const ChartElement = (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 8, left: getLineChartLeftMargin(chartData), bottom: 0 }}
      >
        <CartesianGrid stroke='hsl(var(--primary)' strokeDasharray='4 4' opacity={0.2} />
        <XAxis
          dataKey='monthDay'
          interval={Math.floor(activeMonthDaysCount / 10)}
          tickFormatter={(tick, index) => (index !== 0 && tick) || ''}
        />
        <YAxis interval='preserveStartEnd' tickFormatter={(value) => formatToCurrency(value)} />
        <Line
          type='monotone'
          strokeWidth={2}
          dataKey='dayTotalRevenue'
          stroke='hsl(var(--primary)'
          activeDot={{ r: 6, style: { fill: 'hsl(var(--primary)', opacity: 0.25 } }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '0.2rem',
            fontFamily: 'var(--font-geist-sans)',
            backgroundColor: 'hsl(var(--background)',
          }}
          formatter={(value) => [formatToCurrency(Number(value)), 'Faturamento']}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return { activeMonth, currentMonthTotalRevenue, updateActiveMonth, ChartElement };
};
