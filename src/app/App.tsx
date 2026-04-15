import { useState } from 'react';
import { Search, User } from 'lucide-react';
import WorkLogModal from './components/WorkLogModal';

interface WorkLog {
  id: string;
  category: string;
  system: string;
  company: string;
  group: string;
  client: string;
  department: string;
  subject: string;
  handledDate: string;
  handler: string;
  createdDate: string;
  incomplete?: boolean;
}

const mockData: WorkLog[] = [
  {
    id: 'CH00002',
    category: '維護',
    system: 'MS',
    company: '全家便利商店股份有限公司',
    group: '統一集團',
    client: '王小明',
    department: '中華',
    subject: '2月勞健保資料匯入與核對',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2024-05-25',
  },
  {
    id: 'CH00003',
    category: '協助',
    system: 'ERP',
    company: '中華電信股份有限公司',
    group: '中華電信集團',
    client: '李佳蓉',
    department: '勞務支援',
    subject: '系統登入異常排查與修正',
    handledDate: '2025-10-25',
    handler: '林小華',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00004',
    category: '開發',
    system: 'MS',
    company: '勞檢主管機關股份有限公司',
    group: '政府單位',
    client: '陳志強',
    department: '中華',
    subject: '員工出勤報表產生功能優化',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00005',
    category: '',
    system: 'MS',
    company: '健康診所',
    group: '醫療體系',
    client: '張雅芳',
    department: '中華',
    subject: '',
    handledDate: '2025-10-15',
    handler: '林小華',
    createdDate: '2025-10-15',
    incomplete: true,
  },
  {
    id: 'CH00006',
    category: '協助',
    system: 'ERP',
    company: '有明紡織股份有限公司',
    group: '遠東集團',
    client: '劉建宏',
    department: '紡織',
    subject: '權限設定調整與測試',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00007',
    category: '開發',
    system: 'MS',
    company: '新聯會新竹分類協會有限公司',
    group: '遠東集團',
    client: '吳淑惠',
    department: '遠紡',
    subject: '資料庫效能調整與索引優化',
    handledDate: '2025-10-25',
    handler: '林小華',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00008',
    category: '維護',
    system: 'ERP',
    company: '聯和電信股份有限公司',
    group: '電信集團',
    client: '林雅婷',
    department: '大集團',
    subject: '帳務對帳功能調整',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00009',
    category: '開發',
    system: 'MS',
    company: '新光紡織股份有限公司',
    group: '新光集團',
    client: '黃俊傑',
    department: '紡織',
    subject: '員工資料匯入功能開發',
    handledDate: '2025-07-25',
    handler: '林小華',
    createdDate: '2025-07-25',
  },
  {
    id: 'CH00010',
    category: '維護',
    system: 'MS',
    company: '總統研究開發股份有限公司',
    group: '研發體系',
    client: '周美玲',
    department: '研發',
    subject: '修正打卡紀錄異常問題',
    handledDate: '2025-10-03',
    handler: '黃麗婷',
    createdDate: '2025-10-03',
  },
  {
    id: 'CH00012',
    category: '開發',
    system: 'ERP',
    company: '主要長期有限責任公司',
    group: '石化集團',
    client: '鄭文博',
    department: '三星石化',
    subject: '新增月報表匯出功能',
    handledDate: '2025-10-25',
    handler: '林小華',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00013',
    category: '協助',
    system: 'MS',
    company: '統華國際商貿股份有限公司',
    group: '統一集團',
    client: '蔡欣怡',
    department: '公關',
    subject: '介面文字修正與調整',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00014',
    category: '維護',
    system: 'ERP',
    company: '統盈服飾股份有限公司',
    group: '統一集團',
    client: '謝宗翰',
    department: '紡織',
    subject: '加班時數計算錯誤修正',
    handledDate: '2025-10-25',
    handler: '林小華',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00015',
    category: '開發',
    system: 'MS',
    company: '小型電器檢驗有限公司',
    group: '檢驗機構',
    client: '許雅玲',
    department: '電器',
    subject: '年度結算報表功能調整',
    handledDate: '2025-10-15',
    handler: '黃麗婷',
    createdDate: '2025-10-15',
  },
  {
    id: 'CH00016',
    category: '協助',
    system: 'ERP',
    company: '中華投資國際股份有限公司',
    group: '中華電信集團',
    client: '楊文宇',
    department: '國際',
    subject: 'Email通知功能設定',
    handledDate: '2025-10-25',
    handler: '林小華',
    createdDate: '2025-10-25',
  },
  {
    id: 'CH00017',
    category: '維護',
    system: 'MS',
    company: '大美國際國家股份有限公司',
    group: '國際集團',
    client: '賴俊宇',
    department: '大集團',
    subject: '系統升級與測試驗證',
    handledDate: '2025-10-25',
    handler: '黃麗婷',
    createdDate: '2024-10-25',
  },
];

export default function App() {
  const [activeNav, setActiveNav] = useState('工作日誌');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部分類');
  const [systemFilter, setSystemFilter] = useState('全部系統');
  const [handlerFilter, setHandlerFilter] = useState('全部人員');
  const defaultStart = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().split('T')[0];
  })();
  const defaultEnd = new Date().toISOString().split('T')[0];
  const [customStartDate, setCustomStartDate] = useState(defaultStart);
  const [customEndDate, setCustomEndDate] = useState(defaultEnd);

  const getDateRange = () => {
    if (customStartDate && customEndDate) {
      return { start: customStartDate, end: customEndDate };
    }
    return null;
  };

  const filteredData = mockData.filter((log) => {
    const matchesCategory = categoryFilter === '全部分類' || log.category === categoryFilter;
    const matchesSystem = systemFilter === '全部系統' || log.system === systemFilter;
    const matchesHandler = handlerFilter === '全部人員' || log.handler === handlerFilter;

    const dateRange = getDateRange();
    const matchesDate = !dateRange || (log.handledDate >= dateRange.start && log.handledDate <= dateRange.end);

    return matchesCategory && matchesSystem && matchesHandler && matchesDate;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white px-6 py-3 shadow-[0px_4px_4px_0px_rgba(60,60,85,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/images/icon-ds-logo.svg" alt="logo" className="w-8 h-8" />
              <span className="text-[18px] text-[#222962]">客戶維運管理</span>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => setActiveNav('待辦')}
                className={`text-sm font-semibold ${
                  activeNav === '待辦' ? 'text-blue-600' : 'text-[#b1b7e6] hover:text-[#8f9bc8]'
                }`}
              >
                待辦
              </button>
              <button
                onClick={() => setActiveNav('我的表單')}
                className={`text-sm font-semibold ${
                  activeNav === '我的表單' ? 'text-blue-600' : 'text-[#b1b7e6] hover:text-[#8f9bc8]'
                }`}
              >
                我的表單
              </button>
              <button
                onClick={() => setActiveNav('表單追蹤')}
                className={`text-sm font-semibold ${
                  activeNav === '表單追蹤' ? 'text-blue-600' : 'text-[#b1b7e6] hover:text-[#8f9bc8]'
                }`}
              >
                表單追蹤
              </button>
              <button
                onClick={() => setActiveNav('工作日誌')}
                className={`text-sm font-semibold ${
                  activeNav === '工作日誌' ? 'text-blue-600' : 'text-[#b1b7e6] hover:text-[#8f9bc8]'
                }`}
              >
                工作日誌
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋資料庫、文件、或功能"
                className="pl-9 pr-4 py-2 bg-[#EFF0F8] rounded-[93px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] w-64 focus:outline-none focus:bg-white focus:border focus:border-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9BC8]" size={16} />
            </div>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-[33px] text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
              + 申請單
            </button>
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="bg-white">
          {/* Header */}
          <div className="py-2.5 flex items-center gap-4">
            <h1 className="text-[20px] font-semibold text-[#2d336b] whitespace-nowrap px-2">工作日誌</h1>

            <button
              onClick={() => { setModalMode('create'); setIsModalOpen(true); }}
              className="px-5 py-2 bg-blue-600 text-white rounded-[33px] text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              + 新增日誌
            </button>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="搜尋工作日誌、公司、姓名"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] w-full focus:outline-none focus:bg-white focus:border focus:border-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F9BC8]" size={16} />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] focus:outline-none focus:bg-white focus:border focus:border-black"
            >
              <option>全部分類</option>
              <option>維護</option>
              <option>協助</option>
              <option>開發</option>
            </select>

            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value)}
              className="px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] focus:outline-none focus:bg-white focus:border focus:border-black"
            >
              <option>全部系統</option>
              <option>MS</option>
              <option>ERP</option>
            </select>

            <select
              value={handlerFilter}
              onChange={(e) => setHandlerFilter(e.target.value)}
              className="px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] focus:outline-none focus:bg-white focus:border focus:border-black"
            >
              <option>全部人員</option>
              <option>黃麗婷</option>
              <option>林小華</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] focus:outline-none focus:bg-white focus:border focus:border-black"
                style={{ colorScheme: 'light' }}
              />
              <span className="text-sm text-[#8F9BC8]">～</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] focus:outline-none focus:bg-white focus:border focus:border-black"
                style={{ colorScheme: 'light' }}
              />
            </div>

            <div className="flex gap-2 ml-auto flex-shrink-0">
              <button className="px-4 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2d336b] hover:bg-[#dee1f4] transition-colors">
                匯入
              </button>
              <button className="px-4 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2d336b] hover:bg-[#dee1f4] transition-colors">
                匯出
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '7%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '6%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="bg-white h-[30px]">
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">案件編號</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">分類</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">系統</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">集團</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">公司</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">部門</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">客戶姓名</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">維護主旨</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">處理人員</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">處理日期</th>
                  <th className="px-2 py-2 text-left text-[12px] text-[#8f9bc8] font-normal">建立日期</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((log, index) => (
                  <tr
                    key={log.id}
                    onClick={() => { setModalMode('edit'); setSelectedLog(log); setIsModalOpen(true); }}
                    className={`h-[40px] transition-colors cursor-pointer ${log.incomplete ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-blue-50'}`}
                  >
                    <td className="px-2 py-3 text-[14px] text-[#106fff]">{log.id}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.category}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.system}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.group}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b] truncate" title={log.company}>{log.company}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.department}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.client}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b] truncate" title={log.subject}>{log.subject}</td>
                    <td className="px-2 py-3 text-[14px]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full bg-purple-400 flex items-center justify-center text-[10px] text-white flex-shrink-0"
                          title={log.handler}
                        >
                          {log.handler[0]}
                        </div>
                        <span className="text-[#2d336b] truncate">{log.handler}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.handledDate}</td>
                    <td className="px-2 py-3 text-[14px] text-[#2d336b]">{log.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white h-[45px] flex items-center justify-center">
            <div className="flex items-center gap-4">
              <button className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                  <path d="M9 1L1 9.5L9 18" stroke="#DEE1F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="text-[14px] text-[#8f9bc8] font-semibold">1 - {filteredData.length} of {filteredData.length}</span>
              <button className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg width="10" height="19" viewBox="0 0 10 19" fill="none">
                  <path d="M1 18L9 9.5L1 1" stroke="#5566A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <WorkLogModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedLog(null); }} mode={modalMode} selectedLog={selectedLog} isIncomplete={!!selectedLog?.incomplete} />
    </div>
  );
}
