import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
})
export class DashboardComponent implements AfterViewInit {
  // --- ตัวแปรสำหรับ Filter ---
  years = [2025, 2024, 2023];
  programs = [
    'ระบบแผนงานอัตโนมัติ (LAP)',
    'ระบบจัดทำแผนพัฒนาท้องถิ่น (Smart Plan)',
    'แผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)',
  ];
  selectedYear: string = '';
  selectedProgram: string = '';

  // --- ตัวแปรสำหรับเก็บข้อมูล ---
  masterDashboardData: any = {}; // เก็บข้อมูลต้นฉบับจาก API
  dashboardData: any = {}; // เก็บข้อมูลที่ผ่านการกรองแล้วสำหรับแสดงผล

  // --- ตัวแปรสำหรับ Pagination ---
  paginatedSalesDetail: any[] = [];
  currentDetailPage = 1;
  detailItemsPerPage = 10;
  totalDetailPages = 1;

  // --- ตัวแปรสำหรับกราฟ ---
  barChart: any;
  pieChart: any;
  barChartByValue: any;
  pieChartByValue: any;
  barChartByYear: any;

  vendorRegisterCode = '';
  model: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService
  ) { }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const role = params['type'];
      this.vendorRegisterCode =
        role == 'admin' ? '' : localStorage.getItem('sellerCode') ?? '';
      this.callRead();
    });
  }

  callRead() {
    this.serviceProviderService
      .post('vendorRegister/read', { sellerCode: this.vendorRegisterCode })
      .subscribe((data) => {
        let temp: any = data;
        this.model = temp.objectData.map((item: any) => item.sellerCode);
        this.callReadDashboard();
      });
  }

  callReadDashboard() {
    this.serviceProviderService
      .post('licenseRegister/getDashboard', { listSellerCode: this.model })
      .subscribe((data) => {
        let temp: any = data;
        // เก็บข้อมูลต้นฉบับ และข้อมูลสำหรับแสดงผล
        this.masterDashboardData = temp.objectData;
        this.dashboardData = { ...this.masterDashboardData }; // Clone object

        this.renderCharts(this.dashboardData);
        this.updateDetailPagination();
      });
  }

  /**
   * ✨ ฟังก์ชันฟิลเตอร์ที่แก้ไขใหม่ทั้งหมด
   */
  filterData() {
    // 1. เริ่มต้นด้วยข้อมูลทั้งหมดจาก master
    let filteredSales = [...this.masterDashboardData.salesDetail];

    // 2. กรองตามปีที่เลือก
    if (this.selectedYear) {
      filteredSales = filteredSales.filter(
        (sale) => sale.year === this.selectedYear.toString()
      );
    }

    // 3. กรองตามโปรแกรมที่เลือก
    if (this.selectedProgram) {
      filteredSales = filteredSales.filter(
        (sale) => sale.program === this.selectedProgram
      );
    }

    // 4. คำนวณข้อมูลสรุปและกราฟใหม่จากข้อมูลที่กรองแล้ว
    this.recalculateDashboardData(filteredSales);
  }

  /**
   * ✨ ฟังก์ชันสำหรับคำนวณข้อมูล Dashboard ใหม่ทั้งหมด
   */
  recalculateDashboardData(filteredSales: any[]) {
    // คำนวณยอดรวมใหม่
    const totalLicense = filteredSales.reduce(
      (sum, sale) => sum + sale.licenseCount,
      0
    );
    const totalCompany = [...new Set(filteredSales.map((s) => s.companyName))]
      .length;

    // คำนวณข้อมูลสำหรับกราฟใหม่
    const salesByProgram = this.groupAndSum(
      filteredSales,
      'program',
      'licenseCount'
    );
    const pieChart = this.groupAndCountUnique(
      filteredSales,
      'program',
      'companyName'
    );
    const salesByProgramValue = this.groupAndSum(
      filteredSales,
      'program',
      'totalPrice'
    );
    const pieChartByValue = this.groupAndSum(
      filteredSales,
      'program',
      'totalPrice',
      'label',
      'value'
    );

    // อัปเดต dashboardData ที่ใช้แสดงผล
    this.dashboardData = {
      ...this.masterDashboardData, // คงข้อมูลบางส่วนไว้
      salesDetail: filteredSales,
      totalLicense: totalLicense,
      totalCompany: totalCompany,
      salesByProgram: salesByProgram,
      pieChart: pieChart,
      salesByProgramValue: salesByProgramValue,
      pieChartByValue: pieChartByValue,
    };

    // Render กราฟและตารางใหม่
    this.renderCharts(this.dashboardData);
    this.currentDetailPage = 1; // กลับไปหน้าแรกของตาราง
    this.updateDetailPagination();
  }

  // --- Helper functions for recalculation ---
  groupAndSum(
    data: any[],
    groupBy: string,
    sumBy: string,
    labelKey = groupBy,
    valueKey = 'totalValue'
  ) {
    const result = data.reduce((acc, current) => {
      const key = current[groupBy];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += current[sumBy];
      return acc;
    }, {});
    return Object.keys(result).map((key) => ({
      [labelKey]: key,
      [valueKey]: result[key],
    }));
  }

  groupAndCountUnique(data: any[], groupBy: string, countUniqueBy: string) {
    const result = data.reduce((acc, current) => {
      const key = current[groupBy];
      if (!acc[key]) {
        acc[key] = new Set();
      }
      acc[key].add(current[countUniqueBy]);
      return acc;
    }, {});
    return Object.keys(result).map((key) => ({
      label: key,
      value: result[key].size,
    }));
  }

  // (ฟังก์ชัน renderCharts, updateDetailPagination, nextDetailPage, prevDetailPage, goBack ไม่มีการเปลี่ยนแปลง)
  // ... (วางฟังก์ชัน renderCharts และอื่นๆ ที่เหลือของคุณที่นี่) ...
  renderCharts(dashboardData: any) {
    // 🔄 ถ้ามี chart เก่าอยู่ให้ destroy ก่อน
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChartByValue) this.barChartByValue.destroy();
    if (this.pieChartByValue) this.pieChartByValue.destroy();
    if (this.barChartByYear) this.barChartByYear.destroy();

    // 🧱 Bar Chart – ยอดขายแต่ละโปรแกรม
    const barData = dashboardData.salesByProgram || [];
    const barLabels = barData.map((x: any) => x.program);
    const barValues = barData.map((x: any) => x.totalLicense); // ใช้ totalValue จาก helper
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'จำนวน License (Key)',
            data: barValues,
            backgroundColor: [
              '#4a90e2',
              '#81c784',
              '#ffb74d',
              '#ba68c8',
              '#f06292',
              '#4dd0e1',
              '#a1887f',
            ],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.formattedValue} key`,
            },
          },
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: {
              color: '#333',
              font: { size: 14 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              stepSize: 1,
            },
          },
        },
      },
    });

    // 🥧 Pie Chart – สัดส่วนการขายแต่ละโปรแกรม (จำนวนองค์กร)
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    const pieData = dashboardData.pieChart || [];
    const pieLabels = pieData.map((x: any) => x.label);
    const pieValues = pieData.map((x: any) => x.value);
    this.pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieValues,
            backgroundColor: [
              '#4a90e2',
              '#81c784',
              '#ffb74d',
              '#9575cd',
              '#e57373',
              '#64b5f6',
              '#aed581',
            ],
            hoverOffset: 8,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#333',
              font: { size: 14 },
              generateLabels: (chart) => {
                const data = chart.data;
                const labels = data?.labels || [];
                const dataset = data?.datasets?.[0];
                const backgroundColors = Array.isArray(dataset?.backgroundColor)
                  ? (dataset!.backgroundColor as string[])
                  : [(dataset?.backgroundColor as string) || '#ccc'];
                const values = dataset?.data || [];

                return labels.map((label: any, i: number) => ({
                  text: `${label} (${values[i]} องค์กร)`,
                  fillStyle: backgroundColors[i] || '#ccc',
                  strokeStyle: '#fff',
                  lineWidth: 2,
                }));
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context?.label || '';
                const value = context?.parsed || 0;
                const datasetValues = (
                  context?.chart?.data?.datasets?.[0]?.data || []
                ).filter((v): v is number => typeof v === 'number');
                const total = datasetValues.reduce((a, b) => a + b, 0);
                const percent = total
                  ? ((value / total) * 100).toFixed(1)
                  : '0';
                return `${label}: ขายได้ทั้งหมด ${value} องค์กร (${percent}%)`;
              },
            },
          },
        },
      },
    });

    const barDataValue = dashboardData.salesByProgramValue || [];
    const barLabelsValue = barDataValue.map((x: any) => x.program);
    const barValuesValue = barDataValue.map((x: any) => x.totalValue);

    const barCtxValue = document.getElementById(
      'barChartByValue'
    ) as HTMLCanvasElement;
    this.barChartByValue = new Chart(barCtxValue, {
      type: 'bar',
      data: {
        labels: barLabelsValue,
        datasets: [
          {
            label: 'มูลค่าขาย (บาท)',
            data: barValuesValue,
            backgroundColor: [
              '#2ecc71',
              '#3498db',
              '#f1c40f',
              '#e74c3c',
              '#9b59b6',
              '#1abc9c',
              '#e67e22',
            ],
            borderRadius: 8,
          },
        ],
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${Number(context.raw).toLocaleString(
                  'th-TH'
                )} บาท`,
            },
          },
          legend: { display: false },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { font: { size: 12 } } },
        },
      },
    });

    // 🥧 Pie Chart – สัดส่วนมูลค่าขาย
    const pieDataValue = dashboardData.pieChartByValue || [];
    const pieLabelsValue = pieDataValue.map((x: any) => x.label);
    const pieValuesValue = pieDataValue.map((x: any) => x.value);

    const pieCtxValue = document.getElementById(
      'pieChartByValue'
    ) as HTMLCanvasElement;
    this.pieChartByValue = new Chart(pieCtxValue, {
      type: 'doughnut',
      data: {
        labels: pieLabelsValue,
        datasets: [
          {
            data: pieValuesValue,
            backgroundColor: [
              '#2ecc71',
              '#3498db',
              '#f1c40f',
              '#e74c3c',
              '#9b59b6',
            ],
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = Number(context.raw);
                const total = (
                  context.chart.data.datasets[0].data as number[]
                ).reduce((a, b) => a + b, 0);
                const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value.toLocaleString(
                  'th-TH'
                )} บาท (${percent}%)`;
              },
            },
          },
        },
      },
    });

    // 📈 Bar Chart – มูลค่ารวมยอดขายต่อปี
    const salesByYearData = dashboardData.salesByYear || [];
    const barLabelsYear = salesByYearData.map((x: any) => x.year.toString());
    const barValuesYear = salesByYearData.map((x: any) => x.totalValue);

    const barCtxYear = document.getElementById('barChartByYear') as HTMLCanvasElement;
    if (this.barChartByYear) this.barChartByYear.destroy();

    this.barChartByYear = new Chart(barCtxYear, {
      type: 'bar',
      data: {
        labels: barLabelsYear,
        datasets: [
          {
            label: 'มูลค่ารวมยอดขาย (บาท)',
            data: barValuesYear,
            backgroundColor: '#42a5f5',
            borderColor: '#1e88e5',
            borderWidth: 1.5,
            borderRadius: 8,
          },
        ],
      },
      options: {
        indexAxis: 'x', // ✅ ทำให้กราฟแนวนอน
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'มูลค่ารวมยอดขายต่อปี (บาท)',
            color: '#333',
            font: { size: 18 },
            padding: { top: 20, bottom: 10 },
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${Number(context.raw).toLocaleString('th-TH')} บาท`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#333',
              callback: (val) => Number(val).toLocaleString('th-TH'),
            },
            title: {
              display: true,
              text: 'มูลค่ารวม (บาท)',
              color: '#555',
              font: { size: 14 },
            },
          },
          y: {
            ticks: {
              color: '#333',
              font: { size: 14 },
            },
            title: {
              display: true,
              text: 'ปี',
              color: '#555',
              font: { size: 14 },
            },
          },
        },
      },
    });

  }

  goBack() {
    if (this.vendorRegisterCode == '') {
      this.router.navigate(['user-admin']);
    } else this.router.navigate(['user']);
  }

  updateDetailPagination(): void {
    if (!this.dashboardData?.salesDetail) {
      this.paginatedSalesDetail = [];
      this.totalDetailPages = 1;
      this.currentDetailPage = 1;
      return;
    }
    const sales = this.dashboardData.salesDetail;

    this.totalDetailPages = Math.ceil(sales.length / this.detailItemsPerPage);
    if (this.totalDetailPages == 0) this.totalDetailPages = 1;
    const startIndex = (this.currentDetailPage - 1) * this.detailItemsPerPage;
    const endIndex = startIndex + this.detailItemsPerPage;
    this.paginatedSalesDetail = sales.slice(startIndex, endIndex);
  }

  nextDetailPage(): void {
    if (this.currentDetailPage < this.totalDetailPages) {
      this.currentDetailPage++;
      this.updateDetailPagination();
    }
  }

  prevDetailPage(): void {
    if (this.currentDetailPage > 1) {
      this.currentDetailPage--;
      this.updateDetailPagination();
    }
  }
}
