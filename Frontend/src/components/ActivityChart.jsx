import { Clock, Activity, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

const ActivityChart = ({ weeklyData }) => {
  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayData = weeklyData.find(d => d.date === format(date, 'yyyy-MM-dd')) || {
      date: format(date, 'yyyy-MM-dd'),
      activeHours: 0,
      totalActions: 0
    };
    return {
      ...dayData,
      displayDate: format(date, 'EEE'),
      fullDate: format(date, 'MMM dd')
    };
  });

  // Calculate weekly stats
  const totalWeeklyHours = last7Days.reduce((sum, day) => sum + day.activeHours, 0);
  const averageDailyHours = (totalWeeklyHours / 7).toFixed(1);
  const mostActiveDay = last7Days.reduce((max, day) => 
    day.activeHours > max.activeHours ? day : max, last7Days[0]
  );

  return (
    <div className="space-y-8">
      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Weekly Hours</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-primary">{totalWeeklyHours}</p>
            <p className="text-lg text-muted-foreground">hours</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">total active time</p>
        </div>

        <div className="bg-primary/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Daily Average</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-primary">{averageDailyHours}</p>
            <p className="text-lg text-muted-foreground">hours</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">per day</p>
        </div>

        <div className="bg-primary/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Most Active</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-primary">{mostActiveDay.activeHours}</p>
            <p className="text-lg text-muted-foreground">hours</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">on {mostActiveDay.fullDate}</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-8">Daily Activity</h3>
        <div className="relative pt-8">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-8 bottom-8 flex flex-col justify-between text-sm text-muted-foreground">
            <span>8h</span>
            <span>6h</span>
            <span>4h</span>
            <span>2h</span>
            <span>0h</span>
          </div>

          {/* Chart grid lines */}
          <div className="absolute left-8 right-0 top-8 bottom-8 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="border-t border-muted/30 w-full h-0"
              />
            ))}
          </div>

          {/* Bars */}
          <div className="grid grid-cols-7 gap-2 pl-8">
            {last7Days.map((day) => (
              <div key={day.date} className="relative group">
                {/* Bar */}
                <div className="relative h-[200px] flex items-end">
                  <div 
                    className="w-full bg-primary/20 hover:bg-primary/30 transition-all rounded-t"
                    style={{ 
                      height: `${(day.activeHours / 8) * 100}%`,
                      minHeight: day.activeHours > 0 ? '4px' : '0'
                    }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border shadow-md rounded-md px-3 py-2 text-sm whitespace-nowrap z-10">
                    <p className="font-medium">{day.fullDate}</p>
                    <p className="text-muted-foreground">{day.activeHours} hours active</p>
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="mt-2 text-center">
                  <div className="font-medium text-sm">{day.displayDate}</div>
                  <div className="text-xs text-muted-foreground">{day.activeHours}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
