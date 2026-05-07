'use client';

import { useState, useMemo } from 'react';

const products = [
  { value: 'PP', label: 'PP (Polypropylene)', refPrice: 8200 },
  { value: 'PE-HDPE', label: 'PE - HDPE', refPrice: 7500 },
  { value: 'PE-LDPE', label: 'PE - LDPE', refPrice: 7800 },
  { value: 'PE-LLDPE', label: 'PE - LLDPE', refPrice: 7600 },
  { value: 'PVC', label: 'PVC', refPrice: 5600 },
  { value: 'ABS', label: 'ABS', refPrice: 9800 },
  { value: 'PET', label: 'PET', refPrice: 6500 },
  { value: 'PS-GPPS', label: 'PS - GPPS', refPrice: 7800 },
];

const ports = [
  { value: 'lagos', label: 'Lagos, Nigeria', freight: 2800 },
  { value: 'tema', label: 'Tema, Ghana', freight: 2600 },
  { value: 'mombasa', label: 'Mombasa, Kenya', freight: 2200 },
  { value: 'dakar', label: 'Dakar, Senegal', freight: 3000 },
  { value: 'abidjan', label: 'Abidjan, Ivory Coast', freight: 2900 },
  { value: 'dar', label: 'Dar es Salaam, Tanzania', freight: 2100 },
  { value: 'durban', label: 'Durban, South Africa', freight: 2400 },
  { value: 'douala', label: 'Douala, Cameroon', freight: 2700 },
  { value: 'maputo', label: 'Maputo, Mozambique', freight: 2300 },
  { value: 'luanda', label: 'Luanda, Angola', freight: 3100 },
  { value: 'djibouti', label: 'Djibouti', freight: 1900 },
  { value: 'conakry', label: 'Conakry, Guinea', freight: 3200 },
];

const USD_RMB = 7.25;
const EUR_RMB = 7.88;
const CONTAINER_CAPACITY = 25;

export default function PricingPage() {
  const [productType, setProductType] = useState('PP');
  const [quantity, setQuantity] = useState(25);
  const [supplierPrice, setSupplierPrice] = useState(8200);
  const [domesticFreight, setDomesticFreight] = useState(500);
  const [customsFee, setCustomsFee] = useState(200);
  const [portCharges, setPortCharges] = useState(800);
  const [oceanFreight, setOceanFreight] = useState(2800);
  const [insuranceRate, setInsuranceRate] = useState(0.3);
  const [profitMargin, setProfitMargin] = useState(15);
  const [selectedPort, setSelectedPort] = useState('lagos');

  const handleProductChange = (value: string) => {
    setProductType(value);
    const product = products.find((p) => p.value === value);
    if (product) setSupplierPrice(product.refPrice);
  };

  const handlePortChange = (value: string) => {
    setSelectedPort(value);
    const port = ports.find((p) => p.value === value);
    if (port) setOceanFreight(port.freight);
  };

  const calculation = useMemo(() => {
    const totalDomesticCostRMB = (supplierPrice * quantity) + domesticFreight + customsFee + portCharges;
    const totalDomesticCostUSD = totalDomesticCostRMB / USD_RMB;
    const fobPerTon = totalDomesticCostUSD / quantity;

    const containers = Math.ceil(quantity / CONTAINER_CAPACITY);
    const totalOceanFreight = oceanFreight * containers;
    const totalOceanFreightPerTon = totalOceanFreight / quantity;

    const cifBeforeInsurance = fobPerTon + totalOceanFreightPerTon;
    const insuranceCost = cifBeforeInsurance * (insuranceRate / 100);
    const cifPerTon = cifBeforeInsurance + insuranceCost;

    const finalPrice = cifPerTon * (1 + profitMargin / 100);
    const totalAmount = finalPrice * quantity;
    const totalCost = cifPerTon * quantity;
    const profitAmount = totalAmount - totalCost;

    return {
      fobPerTon: fobPerTon.toFixed(2),
      cifPerTon: cifPerTon.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      profitAmount: profitAmount.toFixed(2),
      containers,
      totalOceanFreight: totalOceanFreight.toFixed(2),
      insuranceCost: insuranceCost.toFixed(2),
    };
  }, [supplierPrice, quantity, domesticFreight, customsFee, portCharges, oceanFreight, insuranceRate, profitMargin]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">价格计算器</h1>
        <p className="text-gray-500 mt-1">快速计算 FOB/CIF 报价，实时汇率换算</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">USD/RMB</p>
            <p className="text-lg font-bold text-gray-900">{USD_RMB.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">EUR/RMB</p>
            <p className="text-lg font-bold text-gray-900">{EUR_RMB.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">所需货柜</p>
            <p className="text-lg font-bold text-gray-900">{calculation.containers} x 20GP</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">预计利润</p>
            <p className="text-lg font-bold text-green-600">${calculation.profitAmount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">输入参数</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品类型</label>
                <select
                  value={productType}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                >
                  {products.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数量（吨）</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  min={1}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-3">成本项目 (RMB)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">供应商报价 (RMB/吨)</label>
                  <input
                    type="number"
                    value={supplierPrice}
                    onChange={(e) => setSupplierPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">国内运费 (RMB)</label>
                  <input
                    type="number"
                    value={domesticFreight}
                    onChange={(e) => setDomesticFreight(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">报关费 (RMB)</label>
                  <input
                    type="number"
                    value={customsFee}
                    onChange={(e) => setCustomsFee(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">港杂费 (RMB)</label>
                  <input
                    type="number"
                    value={portCharges}
                    onChange={(e) => setPortCharges(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-3">海运与保险</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">目的港</label>
                  <select
                    value={selectedPort}
                    onChange={(e) => handlePortChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                  >
                    {ports.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">海运费 (USD/柜)</label>
                  <input
                    type="number"
                    value={oceanFreight}
                    onChange={(e) => setOceanFreight(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">保险费率 (%)</label>
                  <input
                    type="number"
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(Number(e.target.value) || 0)}
                    step={0.1}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">目标利润率 (%)</label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">计算结果</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">FOB 价格</p>
                  <p className="text-xs text-gray-400">含国内成本</p>
                </div>
                <p className="text-xl font-bold text-gray-900">${calculation.fobPerTon}<span className="text-sm font-normal text-gray-500">/吨</span></p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">CIF 价格</p>
                  <p className="text-xs text-gray-400">含海运+保险</p>
                </div>
                <p className="text-xl font-bold text-gray-900">${calculation.cifPerTon}<span className="text-sm font-normal text-gray-500">/吨</span></p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 bg-orange-50 -mx-5 px-5 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-accent-dark">最终报价</p>
                  <p className="text-xs text-gray-400">含 {profitMargin}% 利润</p>
                </div>
                <p className="text-2xl font-bold text-accent">${calculation.finalPrice}<span className="text-sm font-normal text-gray-500">/吨</span></p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">总金额</p>
                <p className="text-lg font-bold text-gray-900">${calculation.totalAmount}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-gray-500">利润金额</p>
                <p className="text-lg font-bold text-green-600">${calculation.profitAmount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">费用明细</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">原材料成本</span>
                <span className="text-gray-900">RMB {(supplierPrice * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">国内运费</span>
                <span className="text-gray-900">RMB {domesticFreight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">报关费</span>
                <span className="text-gray-900">RMB {customsFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">港杂费</span>
                <span className="text-gray-900">RMB {portCharges.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm">
                <span className="text-gray-500">海运费 ({calculation.containers} 柜)</span>
                <span className="text-gray-900">USD {calculation.totalOceanFreight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">保险费 ({insuranceRate}%)</span>
                <span className="text-gray-900">USD {calculation.insuranceCost}/吨</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-dark to-primary rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-2">报价建议</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              {Number(calculation.finalPrice) < 1000
                ? '当前报价偏低，建议核实供应商价格或适当提高利润率。'
                : Number(calculation.finalPrice) > 1500
                ? '报价较高，在非洲市场可能缺乏竞争力。建议优化供应链成本或选择更具性价比的产品。'
                : `当前 CIF ${ports.find(p => p.value === selectedPort)?.label || ''} 报价 $${calculation.finalPrice}/吨 处于合理区间。建议根据客户订单量给予阶梯优惠：50MT以上减 $10/吨，100MT以上减 $20/吨。`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
