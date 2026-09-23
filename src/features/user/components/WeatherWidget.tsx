import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { Cloud, CloudRain, Sun, Sparkles, Thermometer, Droplets, Wind, Umbrella, ChevronLeft, ChevronRight } from 'lucide-react';

interface HourlyForecast {
  hour: number;
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  isCloudy: boolean;
  isRainy: boolean;
}

export default function WeatherWidget() {
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(new Date().getHours());
  const [loading, setLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m&forecast_days=1'
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hourly && data.hourly.time) {
          const currentHour = new Date().getHours();
          const times: string[] = data.hourly.time;
          const temps: number[] = data.hourly.temperature_2m;
          const humidity: number[] = data.hourly.relative_humidity_2m;
          const feels: number[] = data.hourly.apparent_temperature;
          const rain: number[] = data.hourly.precipitation_probability;
          const wind: number[] = data.hourly.wind_speed_10m;

          const forecastList: HourlyForecast[] = [];
          // Build full 24 hours (0:00 to 23:00)
          for (let i = 0; i < 24; i++) {
            if (times[i]) {
              const h = new Date(times[i]).getHours();
              const rProb = rain[i] || 0;
              forecastList.push({
                hour: h,
                time: `${h}:00`,
                temp: Math.round(temps[i] * 10) / 10,
                feelsLike: Math.round(feels[i] * 10) / 10,
                humidity: humidity[i] || 70,
                rainProb: rProb,
                windSpeed: Math.round(wind[i] * 10) / 10,
                isRainy: rProb > 40,
                isCloudy: rProb <= 40
              });
            }
          }

          if (forecastList.length === 24) {
            setHourlyData(forecastList);
            setSelectedIndex(currentHour);
            setLoading(false);
            return;
          }
        }
        throw new Error('Fallback static weather');
      })
      .catch(() => {
        const currentHour = new Date().getHours();
        const fallbackList: HourlyForecast[] = Array.from({ length: 24 }, (_, h) => ({
          hour: h,
          time: `${h}:00`,
          temp: Math.round((24 + Math.sin(h / 3) * 4) * 10) / 10,
          feelsLike: Math.round((28 + Math.sin(h / 3) * 5) * 10) / 10,
          humidity: Math.min(95, Math.max(60, Math.round(85 - Math.sin(h / 3) * 15))),
          rainProb: h >= 18 && h <= 22 ? 30 : 10,
          windSpeed: Math.round((1.5 + Math.random() * 2) * 10) / 10,
          isRainy: false,
          isCloudy: h >= 12
        }));

        setHourlyData(fallbackList);
        setSelectedIndex(currentHour);
        setLoading(false);
      });
  }, []);

  // Auto-scroll selected hour into view smoothly
  useEffect(() => {
    if (!loading && itemRefs.current[selectedIndex]) {
      setTimeout(() => {
        itemRefs.current[selectedIndex]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }, 100);
    }
  }, [selectedIndex, loading]);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleShowAdvice = () => {
    const selectedSlot = hourlyData[selectedIndex] || hourlyData[0];
    const isHot = selectedSlot.feelsLike > 32;
    const isRain = selectedSlot.rainProb > 40;

    let adviceTitle = `💡 Gợi Ý Lộ Trình Tập Luyện (${selectedSlot.time})`;
    let adviceText = '';

    if (isRain) {
      adviceText = `Thời tiết lúc ${selectedSlot.time} dự báo có mưa (${selectedSlot.rainProb}%). Thích hợp tập luyện trong phòng GYM máy lạnh, các bài tập Tạ & Kháng lực!`;
    } else if (isHot) {
      adviceText = `Thời tiết lúc ${selectedSlot.time} Cảm giác nhiệt khá oi nóng (${selectedSlot.feelsLike}°C). Hãy ưu tiên tập luyện trong phòng máy lạnh và mang theo 1.5L nước bù khoáng!`;
    } else {
      adviceText = `Thời tiết lúc ${selectedSlot.time} lý tưởng (${selectedSlot.temp}°C). Rất thích hợp cho bài tập Cardio, Chạy bộ và các bài tập tăng cường sức bền!`;
    }

    Swal.fire({
      title: adviceTitle,
      text: adviceText,
      icon: 'info',
      confirmButtonText: 'Đã hiểu',
      confirmButtonColor: '#c3f400',
      background: '#18181b',
      color: '#ffffff',
      customClass: {
        confirmButton: 'text-black font-bold'
      }
    });
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4 h-full box-border backdrop-blur-sm relative overflow-hidden w-full min-w-0 max-w-full">
      <div className="flex justify-between items-center w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-base font-bold text-white tracking-tight truncate">Dự báo thời tiết hôm nay</h3>
          <span className="text-xs text-zinc-400 font-medium shrink-0">(24 giờ)</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleScrollLeft}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center border border-zinc-700 transition-colors"
            title="Cuộn sang trái"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleScrollRight}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center border border-zinc-700 transition-colors"
            title="Cuộn sang phải"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleShowAdvice}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/80 text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles size={14} className="text-[#c3f400]" />
            <span className="hidden sm:inline">Gợi ý tập luyện</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-36 flex items-center justify-center text-zinc-400 text-xs">
          Đang tải dự báo thời tiết 24h...
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth py-1 px-0.5 flex-1 w-full min-w-0 max-w-full"
          style={{ scrollbarWidth: 'thin' }}
        >
          {hourlyData.map((item, index) => {
            const isSelected = selectedIndex === index;
            const isCurrentHour = new Date().getHours() === item.hour;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => setSelectedIndex(index)}
                className={`min-w-[130px] flex-shrink-0 rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all select-none ${
                  isSelected
                    ? 'border-2 border-[#c3f400] bg-zinc-800/90 shadow-[0_0_15px_rgba(195,244,0,0.15)] scale-[1.02]'
                    : 'bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50'
                }`}
              >
                <div className="flex items-center gap-1 mb-2">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-[#c3f400] font-bold' : 'text-zinc-400'}`}>
                    {item.time}
                  </span>
                  {isCurrentHour && (
                    <span className="bg-[#c3f400] text-black text-[9px] font-extrabold px-1 rounded uppercase">
                      HIỆN TẠI
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  {item.isRainy ? (
                    <CloudRain size={26} className="text-blue-400" />
                  ) : item.isCloudy ? (
                    <Cloud size={26} className="text-zinc-400" />
                  ) : (
                    <Sun size={26} className="text-amber-400" />
                  )}
                </div>

                <div className="font-sans text-base font-extrabold text-white mb-2">{item.temp}°C</div>

                <div className="w-full flex flex-col gap-1 pt-2 border-t border-zinc-700/50 text-[10px] text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Thermometer size={10} className="text-zinc-400" /> Cảm giác
                    </span>
                    <span className="font-semibold text-zinc-200">{item.feelsLike}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Droplets size={10} className="text-zinc-400" /> Ẩm
                    </span>
                    <span className="font-semibold text-zinc-200">{item.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Umbrella size={10} className="text-zinc-400" /> Mưa
                    </span>
                    <span className="font-semibold text-zinc-200">{item.rainProb}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Wind size={10} className="text-zinc-400" /> Gió
                    </span>
                    <span className="font-semibold text-zinc-200">{item.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
