import React, { useMemo, useState } from 'react';

export default function App() {
	// ค่าตั้งต้นตามโจทย์
	const [costPerCup, setCostPerCup] = useState(0);
	const [pricePerCup, setPricePerCup] = useState(25);
	const [targetProfit, setTargetProfit] = useState(1000);

	// ฟอร์แมตตัวเลขแบบไทย
	const thNumber = (n) =>
		new Intl.NumberFormat('th-TH').format(Number.isFinite(n) ? n : 0);
	const thCurrency = (n) =>
		new Intl.NumberFormat('th-TH', {
			style: 'currency',
			currency: 'THB',
			maximumFractionDigits: 0,
		}).format(Number.isFinite(n) ? n : 0);

	const marginPerCup = useMemo(
		() => pricePerCup - costPerCup,
		[pricePerCup, costPerCup],
	);

	const cupsNeeded = useMemo(() => {
		if (!Number.isFinite(marginPerCup) || marginPerCup <= 0) return 0;
		return Math.ceil((Number(targetProfit) || 0) / marginPerCup);
	}, [marginPerCup, targetProfit]);

	const totalCost = useMemo(
		() => cupsNeeded * (Number(costPerCup) || 0),
		[cupsNeeded, costPerCup],
	);
	const revenueAtGoal = useMemo(
		() => cupsNeeded * (Number(pricePerCup) || 0),
		[cupsNeeded, pricePerCup],
	);
	const profitAtGoal = useMemo(
		() => revenueAtGoal - totalCost,
		[revenueAtGoal, totalCost],
	);
	const profitPerCup = marginPerCup;

	const invalid = marginPerCup <= 0;

	return (
		<div className='min-h-screen bg-neutral-50 flex items-center justify-center p-4'>
			{/* ฟอนต์ไม่มีหัว (Prompt) */}
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600&display=swap');
        :root { color-scheme: light; }
        html, body, #root { height: 100%; }
        body { font-family: 'Prompt', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans Thai', Arial, sans-serif; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

			<div className='w-full max-w-3xl'>
				<header className='mb-6'>
					<h1 className='text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight'>
						คำนวณกำไร “ร้านขายนํ้า”
					</h1>
					<p className='text-neutral-500 mt-1'>
						กรอกต้นทุน–ราคาขาย–กำไรที่อยากได้
						ระบบจะคำนวณจำนวนแก้วและต้นทุนรวมให้อัตโนมัติ
					</p>
				</header>

				<div className='grid gap-4 md:gap-6 md:grid-cols-3'>
					<Card>
						<Label>ต้นทุนต่อแก้ว (บาท)</Label>
						<NumberInput
							value={costPerCup}
							min={0}
							onChange={setCostPerCup}
							placeholder='เช่น 10'
						/>
						<Hint>รวมวัตถุดิบ บรรจุภัณฑ์ ฯลฯ</Hint>
					</Card>

					<Card>
						<Label>ราคาขายต่อแก้ว (บาท)</Label>
						<NumberInput
							value={pricePerCup}
							min={0}
							onChange={setPricePerCup}
							placeholder='เช่น 25'
						/>
						<Hint>ราคาที่ลูกค้าจ่ายจริง</Hint>
					</Card>

					<Card>
						<Label>กำไรที่ต้องการ (บาท)</Label>
						<NumberInput
							value={targetProfit}
							min={0}
							step={100}
							onChange={setTargetProfit}
							placeholder='เช่น 7000'
						/>
						<Hint>ยอดกำไรเป้าหมาย</Hint>
					</Card>
				</div>

				<div className='mt-6 grid gap-4 md:gap-6 md:grid-cols-3'>
					<ResultCard
						title='ต้องขายกี่แก้ว'
						value={invalid ? '—' : thNumber(cupsNeeded)}
						sub={
							invalid
								? 'กำไรต่อแก้วต้องมากกว่า 0'
								: `จากกำไรต่อแก้ว ${thCurrency(profitPerCup)}`
						}
					/>

					<ResultCard
						title='ต้นทุนรวม'
						value={invalid ? '—' : thCurrency(totalCost)}
						sub={
							invalid
								? 'ตรวจสอบราคาขายและต้นทุน'
								: `ต้นทุนต่อแก้ว ${thCurrency(costPerCup)}`
						}
					/>

					<ResultCard
						title='ยอดขาย ณ เป้าหมาย'
						value={invalid ? '—' : thCurrency(revenueAtGoal)}
						sub={invalid ? '—' : `กำไรคาดได้ ${thCurrency(profitAtGoal)}`}
					/>
				</div>

				<div className='mt-8 flex flex-wrap items-center gap-3'>
					<button
						className='px-4 py-2 rounded-2xl bg-neutral-900 text-white shadow-sm hover:opacity-90 active:opacity-80 transition'
						onClick={() => {
							setCostPerCup(10);
							setPricePerCup(25);
							setTargetProfit(7000);
						}}
					>
						คืนค่าโจทย์
					</button>
					<ShareButton
						cost={costPerCup}
						price={pricePerCup}
						profit={targetProfit}
					/>
				</div>

				<HowItWorks className='mt-10' />
			</div>
		</div>
	);
}

function Card({ children }) {
	return (
		<div className='bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm'>
			{children}
		</div>
	);
}

function ResultCard({ title, value, sub }) {
	return (
		<div className='bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-1'>
			<div className='text-sm text-neutral-500'>{title}</div>
			<div className='text-3xl font-semibold leading-tight text-neutral-900'>
				{value}
			</div>
			{sub && <div className='text-sm text-neutral-400'>{sub}</div>}
		</div>
	);
}

function Label({ children }) {
	return (
		<label className='text-sm font-medium text-neutral-800'>{children}</label>
	);
}

function Hint({ children }) {
	return <p className='text-xs text-neutral-400'>{children}</p>;
}

function NumberInput({ value, onChange, min = 0, step = 1, placeholder }) {
	return (
		<input
			type='number'
			inputMode='decimal'
			value={value}
			onChange={(e) => onChange(safeNumber(e.target.value))}
			min={min}
			step={step}
			placeholder={placeholder}
			className='mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:ring-4 focus:ring-neutral-200'
		/>
	);
}

function safeNumber(v) {
	const num = Number(v);
	return Number.isFinite(num) ? num : 0;
}

function ShareButton({ cost, price, profit }) {
	const [copied, setCopied] = React.useState(false);
	const link = useMemo(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('cost', String(cost));
		url.searchParams.set('price', String(price));
		url.searchParams.set('profit', String(profit));
		return url.toString();
	}, [cost, price, profit]);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<button
			onClick={copy}
			className='px-4 py-2 rounded-2xl bg-white text-neutral-900 border border-neutral-200 shadow-sm hover:bg-neutral-50 transition'
		>
			{copied ? 'คัดลอกแล้ว' : 'แชร์ลิงก์ค่า'}
		</button>
	);
}

function HowItWorks({ className = '' }) {
	return (
		<section
			className={
				'bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm ' +
				className
			}
		>
			<h2 className='text-lg font-semibold text-neutral-900'>
				วิธีคิดแบบสั้น ๆ
			</h2>
			<ol className='mt-2 space-y-1 list-decimal list-inside text-neutral-700'>
				<li>หากำไรต่อแก้ว = ราคาขาย − ต้นทุน</li>
				<li>
					จำนวนแก้วที่ต้องขาย = กำไรที่ต้องการ ÷ กำไรต่อแก้ว (เป็นขั้นตํ่า)
				</li>
				<li>ต้นทุนรวม = จำนวนแก้ว × ต้นทุนต่อแก้ว</li>
			</ol>
		</section>
	);
}
