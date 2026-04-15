import { useState, useEffect } from 'react';
import { X, Upload, Save, MoreVertical, Settings, Trash2, Edit2, FileText } from 'lucide-react';
import SearchableSelect from './ui/SearchableSelect';

const CURRENT_USER = '黃麗婷';

const HANDLERS = ['黃麗婷', '林小華', '王小明', '陳志強'];

const MOCK_FILES = [
  { id: '1', name: '客戶需求說明_2026Q1.pdf' },
  { id: '2', name: '系統截圖_錯誤畫面.png' },
  { id: '3', name: '處理紀錄_20260415.xlsx' },
];

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
}

interface WorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  selectedLog?: WorkLog | null;
  isIncomplete?: boolean;
}

interface QuickSelectGroup {
  id: string;
  name: string;
  company: string;
  clientName: string;
  department: string;
  group: string;
  projectName: string;
}

const categoryValueMap: Record<string, string> = {
  '協助': 'assist',
  '維護': 'maintain',
  '開發': 'develop',
};

const COMPANY_OPTIONS = [
  '全家便利商店股份有限公司', '中華電信股份有限公司', '勞檢主管機關股份有限公司',
  '健康診所', '有明紡織股份有限公司', '新聯會新竹分類協會有限公司',
  '聯和電信股份有限公司', '新光紡織股份有限公司', '總統研究開發股份有限公司',
  '主要長期有限責任公司', '統華國際商貿股份有限公司', '統盈服飾股份有限公司',
  '小型電器檢驗有限公司', '中華投資國際股份有限公司', '大美國際國家股份有限公司',
].map(c => ({ value: c, label: c }));

const CLIENT_OPTIONS = [
  '王小明', '李佳蓉', '陳志強', '張雅芳', '劉建宏', '吳淑惠',
  '林雅婷', '黃俊傑', '周美玲', '鄭文博', '蔡欣怡', '謝宗翰',
  '許雅玲', '楊文宇', '賴俊宇',
].map(c => ({ value: c, label: c }));

export default function WorkLogModal({ isOpen, onClose, mode = 'create', selectedLog, isIncomplete = false }: WorkLogModalProps) {
  const initialForm = selectedLog ? {
    quickSelect: '',
    company: selectedLog.company,
    name: selectedLog.client,
    department: selectedLog.department,
    group: selectedLog.group,
    date: selectedLog.handledDate,
    category: categoryValueMap[selectedLog.category] ?? '',
    systemName: selectedLog.system,
    projectName: '專案 A',
    handler: selectedLog.handler,
    subject: selectedLog.subject,
    content: '客戶反映系統操作問題，進行排查與處理。',
    solution: '確認問題原因，完成修正並通知客戶驗證。',
    sql: '',
    hours: '1',
  } : {
    quickSelect: '',
    company: '',
    name: '',
    department: '',
    group: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    systemName: 'MS',
    projectName: '',
    handler: CURRENT_USER,
    subject: '',
    content: '',
    solution: '',
    sql: '',
    hours: '0.5',
  };
  const [formData, setFormData] = useState(initialForm);
  const [showSaveGroupInput, setShowSaveGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [quickSelectGroups, setQuickSelectGroups] = useState<QuickSelectGroup[]>([
    { id: '1', name: '群組 1', company: '公司 A', clientName: '王小明', department: '資訊部', group: '集團 A', projectName: '專案 A' },
    { id: '2', name: '群組 2', company: '公司 B', clientName: '李小華', department: '業務部', group: '集團 B', projectName: '專案 B' },
  ]);
  const [editingGroup, setEditingGroup] = useState<QuickSelectGroup | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(selectedLog ? {
      quickSelect: '',
      company: selectedLog.company,
      name: selectedLog.client,
      department: selectedLog.department,
      group: selectedLog.group,
      date: selectedLog.handledDate,
      category: categoryValueMap[selectedLog.category] ?? '',
      systemName: selectedLog.system,
      projectName: 'project1',
      handler: selectedLog.handler,
      subject: selectedLog.subject,
      content: '客戶反映系統操作問題，進行排查與處理。',
      solution: '確認問題原因，完成修正並通知客戶驗證。',
      sql: '',
      hours: '1',
    } : {
      quickSelect: '',
      company: '',
      name: '',
      department: '',
      group: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      systemName: 'MS',
      projectName: '',
      handler: CURRENT_USER,
      subject: '',
      content: '',
      solution: '',
      sql: '',
      hours: '0.5',
    });
    setShowErrors(false);
  }, [selectedLog, isOpen]);

  const REQUIRED_FIELDS = ['company', 'name', 'projectName', 'category', 'subject', 'content'] as const;

  const validate = () => REQUIRED_FIELDS.every(f => !!formData[f]);

  const isError = (field: typeof REQUIRED_FIELDS[number]) => showErrors && !formData[field];

  // 公司與對應的集團
  const companyMapping: Record<string, { group: string }> = {
    '全家便利商店股份有限公司': { group: '統一集團' },
    '中華電信股份有限公司': { group: '中華電信集團' },
    '有明紡織股份有限公司': { group: '遠東集團' },
    '新聯會新竹分類協會有限公司': { group: '遠東集團' },
    '統華國際商貿股份有限公司': { group: '統一集團' },
    '統盈服飾股份有限公司': { group: '統一集團' },
    '中華投資國際股份有限公司': { group: '中華電信集團' },
  };

  // 客戶姓名與對應的部門
  const clientMapping: Record<string, { department: string }> = {
    '王小明': { department: '中華' },
    '李佳蓉': { department: '勞務支援' },
    '陳志強': { department: '中華' },
    '張雅芳': { department: '中華' },
    '劉建宏': { department: '紡織' },
    '吳淑惠': { department: '遠紡' },
    '林雅婷': { department: '大集團' },
    '黃俊傑': { department: '紡織' },
    '周美玲': { department: '研發' },
    '鄭文博': { department: '三星石化' },
    '蔡欣怡': { department: '公關' },
    '謝宗翰': { department: '紡織' },
    '許雅玲': { department: '電器' },
    '楊文宇': { department: '國際' },
    '賴俊宇': { department: '大集團' },
  };

  // 專案名稱與對應的處理人員
  const projectMapping: Record<string, { handler: string }> = {
    'project1': { handler: '黃麗婷' },
    'project2': { handler: '林小華' },
    'project3': { handler: '王小明' },
  };

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAsGroup = () => {
    if (newGroupName.trim()) {
      // 檢查至少有一個欄位有值
      const hasValue = formData.company || formData.name || formData.department || formData.group || formData.projectName;
      if (!hasValue) {
        alert('請至少填寫一個欄位後再儲存');
        return;
      }

      const newGroup: QuickSelectGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        company: formData.company,
        clientName: formData.name,
        department: formData.department,
        group: formData.group,
        projectName: formData.projectName,
      };

      setQuickSelectGroups([...quickSelectGroups, newGroup]);
      setShowSaveGroupInput(false);
      setNewGroupName('');
      setShowMoreMenu(false);
    }
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('確定要刪除此快選群組嗎？')) {
      setQuickSelectGroups(quickSelectGroups.filter(g => g.id !== id));
    }
  };

  const handleEditGroup = (group: QuickSelectGroup) => {
    setEditingGroup({ ...group });
  };

  const handleSaveEditGroup = () => {
    if (editingGroup) {
      setQuickSelectGroups(quickSelectGroups.map(g =>
        g.id === editingGroup.id ? editingGroup : g
      ));
      setEditingGroup(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[1100px] h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg">{mode === 'edit' ? '編輯工作日誌' : '新增工作日誌'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex flex-1 min-h-0">
          <div className="flex w-full min-h-0">
            {/* Left Column */}
            <div className="w-[40%] px-6 py-5 border-r border-gray-200 overflow-y-auto">
              {/* Section 1: Quick Select */}
              <div className="mb-4">
                <div>
                  <label className="block text-sm mb-1.5 text-[#FF7F29]">快選群組</label>
                  <div className="flex gap-2 relative">
                    <SearchableSelect
                      value={formData.quickSelect}
                      options={quickSelectGroups.map(g => ({ value: g.id, label: g.name }))}
                      onChange={(val) => {
                        const selectedGroup = quickSelectGroups.find(g => g.id === val);
                        if (selectedGroup) {
                          handleInputChange('company', selectedGroup.company);
                          handleInputChange('name', selectedGroup.clientName);
                          handleInputChange('department', selectedGroup.department);
                          handleInputChange('group', selectedGroup.group);
                          handleInputChange('projectName', selectedGroup.projectName);
                        }
                        handleInputChange('quickSelect', val);
                      }}
                    />
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                      title="更多選項"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {/* More Menu Dropdown */}
                    {showMoreMenu && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setShowSaveGroupInput(true);
                            setShowMoreMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Save size={16} />
                          儲存當前組合
                        </button>
                        <button
                          onClick={() => {
                            setShowManageModal(true);
                            setShowMoreMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-t"
                        >
                          <Settings size={16} />
                          管理群組
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 處理日期 & 系統名 */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">處理日期</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">系統名</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="systemName"
                          value="MS"
                          checked={formData.systemName === 'MS'}
                          onChange={(e) => handleInputChange('systemName', e.target.value)}
                          className="mr-2 appearance-none w-4 h-4 border-2 border-gray-300 rounded-full bg-white checked:border-blue-500 checked:bg-blue-500 checked:ring-2 checked:ring-white checked:ring-inset cursor-pointer"
                        />
                        <span className="text-sm">MS</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="systemName"
                          value="ERP"
                          checked={formData.systemName === 'ERP'}
                          onChange={(e) => handleInputChange('systemName', e.target.value)}
                          className="mr-2 appearance-none w-4 h-4 border-2 border-gray-300 rounded-full bg-white checked:border-blue-500 checked:bg-blue-500 checked:ring-2 checked:ring-white checked:ring-inset cursor-pointer"
                        />
                        <span className="text-sm">ERP</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Select Group Fields */}
              <div className="mb-4">
                {showSaveGroupInput && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <label className="block text-sm mb-1.5 text-[#FF7F29]">群組名稱</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="輸入群組名稱"
                        className="flex-1 px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                      />
                      <button
                        onClick={handleSaveAsGroup}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setShowSaveGroupInput(false);
                          setNewGroupName('');
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1.5 text-[#FF7F29]">公司 <span>*</span></label>
                      <SearchableSelect
                        value={formData.company}
                        options={COMPANY_OPTIONS}
                        onChange={(val) => {
                          handleInputChange('company', val);
                          if (val && companyMapping[val]) {
                            handleInputChange('group', companyMapping[val].group);
                          }
                        }}
                        error={isError('company')}
                      />
                      {isError('company') && <p className="text-xs text-red-500 mt-1">必填</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5 text-[#FF7F29]">集團</label>
                      <input
                        type="text"
                        value={formData.group}
                        onChange={(e) => handleInputChange('group', e.target.value)}
                        className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1.5 text-[#FF7F29]">客戶姓名 <span>*</span></label>
                      <SearchableSelect
                        value={formData.name}
                        options={CLIENT_OPTIONS}
                        onChange={(val) => {
                          handleInputChange('name', val);
                          if (val && clientMapping[val]) {
                            handleInputChange('department', clientMapping[val].department);
                          }
                        }}
                        error={isError('name')}
                      />
                      {isError('name') && <p className="text-xs text-red-500 mt-1">必填</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5 text-[#FF7F29]">部門</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5 text-[#FF7F29]">專案名稱 <span>*</span></label>
                    <SearchableSelect
                      value={formData.projectName}
                      options={[{ value: 'project1', label: '專案 A' }, { value: 'project2', label: '專案 B' }, { value: 'project3', label: '專案 C' }]}
                      onChange={(val) => {
                        handleInputChange('projectName', val);
                        if (val && projectMapping[val]) {
                          handleInputChange('handler', projectMapping[val].handler);
                        }
                      }}
                      error={isError('projectName')}
                    />
                    {isError('projectName') && <p className="text-xs text-red-500 mt-1">必填</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Log Attributes */}
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1.5 text-[#3774CE]">處理人員</label>
                      <SearchableSelect
                        value={formData.handler}
                        options={HANDLERS.map(name => ({ value: name, label: name }))}
                        onChange={(val) => handleInputChange('handler', val)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5 text-[#3774CE]">分類 <span>*</span></label>
                      <SearchableSelect
                        value={formData.category}
                        options={[{ value: 'assist', label: '協助' }, { value: 'maintain', label: '維護' }, { value: 'develop', label: '開發' }]}
                        onChange={(val) => handleInputChange('category', val)}
                        searchable={false}
                        error={isError('category')}
                      />
                      {isError('category') && <p className="text-xs text-red-500 mt-1">必填</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">處理工時</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.hours}
                        onChange={(e) => handleInputChange('hours', e.target.value)}
                        className="w-32 px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                      />
                      <span className="text-sm text-gray-600">小時</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-[60%] px-6 py-5 overflow-y-auto">
              {/* Section 4: Log Content */}
              <div className="mb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">維護主旨 <span>*</span></label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className={`w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black ${isError('subject') ? 'ring-1 ring-red-500' : ''}`}
                    />
                    {isError('subject') && <p className="text-xs text-red-500 mt-1">必填</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">維護內容 <span>*</span></label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black resize-none ${isError('content') ? 'ring-1 ring-red-500' : ''}`}
                    />
                    {isError('content') && <p className="text-xs text-red-500 mt-1">必填</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">處理說明</label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => handleInputChange('solution', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5 text-[#3774CE]">SQL 語法</label>
                    <textarea
                      value={formData.sql}
                      onChange={(e) => handleInputChange('sql', e.target.value)}
                      placeholder="選填"
                      rows={3}
                      className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black resize-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Other */}
              <div>
                <div>
                  <label className="block text-sm mb-1.5 text-[#3774CE]">附件上傳</label>
                  <button
                    onClick={() => setUploadedFiles(MOCK_FILES)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Upload size={16} />
                    上傳附件
                  </button>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-2 px-3 py-2 bg-[#EFF0F8] rounded-[10px] w-72">
                          <FileText size={15} className="text-[#3774CE] flex-shrink-0" />
                          <span className="flex-1 text-sm text-[#2D336B] truncate">{file.name}</span>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                            className="text-[#8F9BC8] hover:text-[#2D336B] transition-colors flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!validate()) { setShowErrors(true); return; }
                console.log('Saving:', formData);
                onClose();
              }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              儲存
            </button>
            {(mode === 'edit' || isIncomplete) && (
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                取消
              </button>
            )}
            {mode === 'create' && (
              <button
                onClick={() => {
                  if (!validate()) { setShowErrors(true); return; }
                  console.log('Saving and continuing:', formData);
                  setFormData({
                    quickSelect: '',
                    company: '',
                    name: '',
                    department: '',
                    group: '',
                    date: new Date().toISOString().split('T')[0],
                    category: '',
                    systemName: 'MS',
                    projectName: '',
                    handler: CURRENT_USER,
                    subject: '',
                    content: '',
                    solution: '',
                    sql: '',
                    hours: '0.5',
                  });
                  setUploadedFiles([]);
                  setShowErrors(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                儲存並繼續
              </button>
            )}
          </div>
          {false && (
            <button
              onClick={() => {
                // Handle delete
                if (confirm('確定要刪除此工作日誌嗎？')) {
                  onClose();
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              刪除
            </button>
          )}
        </div>
      </div>

      {/* Manage Groups Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl w-[600px] max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg">快選群組管理</h3>
              <button
                onClick={() => {
                  setShowManageModal(false);
                  setEditingGroup(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {quickSelectGroups.length === 0 ? (
                <div className="text-center text-gray-500 py-8">尚無快選群組</div>
              ) : (
                <div className="space-y-3">
                  {quickSelectGroups.map(group => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                      {editingGroup?.id === group.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1.5 text-[#3774CE]">群組名稱</label>
                            <input
                              type="text"
                              value={editingGroup.name}
                              onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                              className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm mb-1.5 text-[#3774CE]">公司</label>
                              <input
                                type="text"
                                value={editingGroup.company}
                                onChange={(e) => setEditingGroup({ ...editingGroup, company: e.target.value })}
                                className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1.5 text-[#3774CE]">客戶姓名</label>
                              <input
                                type="text"
                                value={editingGroup.clientName}
                                onChange={(e) => setEditingGroup({ ...editingGroup, clientName: e.target.value })}
                                className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm mb-1.5 text-[#3774CE]">部門</label>
                              <input
                                type="text"
                                value={editingGroup.department}
                                onChange={(e) => setEditingGroup({ ...editingGroup, department: e.target.value })}
                                className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1.5 text-[#3774CE]">集團</label>
                              <input
                                type="text"
                                value={editingGroup.group}
                                onChange={(e) => setEditingGroup({ ...editingGroup, group: e.target.value })}
                                className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm mb-1.5 text-[#3774CE]">專案名稱</label>
                            <input
                              type="text"
                              value={editingGroup.projectName}
                              onChange={(e) => setEditingGroup({ ...editingGroup, projectName: e.target.value })}
                              className="w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none focus:bg-white focus:border focus:border-black"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingGroup(null)}
                              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleSaveEditGroup}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                            >
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{group.name}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditGroup(group)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="編輯"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="刪除"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {group.company && <div>公司：{group.company}</div>}
                            {group.clientName && <div>客戶姓名：{group.clientName}</div>}
                            {group.department && <div>部門：{group.department}</div>}
                            {group.group && <div>集團：{group.group}</div>}
                            {group.projectName && <div>專案：{group.projectName}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
