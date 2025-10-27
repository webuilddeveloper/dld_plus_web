import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  // server: string = 'http://localhost:8550/';
  server: string = 'https://gateway.we-builds.com/we-lap-api/';
  serverReport: string = 'https://gateway.we-builds.com/report-wb-api/';

  constructor(
    private http: HttpClient,
  ) { }

  lang: string = localStorage.getItem('lang_20220630') ?? 'en';

  post(url: string, param: any) {

    param.organization = [];
    param.permission = 'all';

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST');

    // let options = new RequestOptions();
    // options.headers = headers;
    // param.organization = JSON.parse(localStorage.getItem('organization'));
    return this.http.post(this.server + url, param, { headers: headers });
  }

  postReport(url: string, param: any) {

    param.organization = [];
    param.permission = 'all';

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST');

    // let options = new RequestOptions();
    // options.headers = headers;
    // param.organization = JSON.parse(localStorage.getItem('organization'));
    return this.http.post(this.serverReport + url, param, {
      headers: headers, responseType: "arraybuffer",
    });
  }


  langModel: any = {
    contactUs: { th: 'ติดต่อเรา', en: 'Contact Us' },
    en: { th: 'อังกฤษ', en: 'EN' },
    home: { th: 'หน้าหลัก', en: 'Home' },
    login: { th: 'เข้าสู่ระบบ', en: 'Login' },
    welcome: { th: 'ยินดีต้อนรับ', en: 'Welcome' },
    news: { th: 'ข่าวประชาสัมพันธ์', en: 'News' },
    newsDescription: { th: 'ความภาคภูมิใจของเรา', en: 'Our Pride' },
    productAndService: { th: 'ผลงาน & บริการ', en: 'Product & Service' },
    productAndServiceDescription: { th: 'เราทำงานหลากหลายและท้าทายอยู่เสมอ', en: 'We always do various challenging works' },
    categoryOfService: { th: 'ประเภทที่เราให้บริการ', en: 'Category we provide service' },
    publicSector: { th: 'ภาครัฐ', en: 'Public Sector' },
    privateSector: { th: 'ภาคเอกชน', en: 'Private Sector' },
    lineAgency: { th: 'ไลน์เอเจนซี', en: 'Line Agency' },
    website: { th: 'เว็บไซต์', en: 'Website' },
    th: { th: 'ไทย', en: 'TH' },
    ourTeam: { th: 'ทีมของเรา', en: 'Our Team' },
    ourMission: { th: 'ภารกิจของเรา', en: 'Our Mission' },
    whoWeAre: { th: 'เราคือใคร', en: 'Who We Are' },
    ourProcess: { th: 'บริการหลักของเรา', en: 'Our Core Services' },
    user: { th: 'ผู้ใช้งาน', en: 'Users' },
    project: { th: 'โครงการ', en: 'Projects' },
    partner2: { th: 'องค์กรที่ร่วมมือกับพวกเรา', en: 'Business Partnerships' },
    partner: { th: 'ลูกค้า', en: 'Customers' },
    product: { th: 'ผลงานที่เราภูมิใจ', en: 'Our Proud Projects' },
    productInProgress: { th: 'ผลงานที่กำลังทำ', en: 'Product In Progress' },
    organizationsWeWorkWith: { th: 'องค์กรที่ไว้วางใจพวกเรา', en: 'Our Trusted Customers' },
    ourPride: { th: 'ความภาคภูมิใจของเรา', en: 'Our Pride' },
    location: { th: 'ที่อยู่ของเรา', en: 'Our Address' },
    contact: { th: 'ติดต่อ', en: 'Contact' },
    highlightFunction: { th: 'ฟังก์ชันเด่น', en: 'Highlight Function' },
    details: { th: 'รายละเอียด', en: 'Details' },
    download: { th: 'ดาวน์โหลด', en: 'Download' },
    send: { th: 'ส่ง', en: 'Send' },
    screenExample: { th: 'ตัวอย่างหน้าจอ', en: 'Screen Example' },
    OurPrideProject: { th: 'ความภูมิใจของเรากับโปรเจคนี้', en: 'Our Pride With This Project' },
    officeActivities: { th: 'WeBuild เราก้าวไปด้วยกัน', en: 'We Build, We’re together' },
    Illustration: { th: 'รูปภาพประกอบ', en: 'Illustration' },
    contactUsDescription: { th: 'เรายินดีเปิดรับทุกความเป็นไปได้', en: 'We’re open to every new possibility' },
    sendYourOpinion: { th: 'ส่งความคิดเห็นของคุณ', en: 'Send Your Opinion' },
    accept: { th: 'ยอมรับ', en: 'Accept' },
    cookieTitle: { th: 'เว็บไซต์ของเรามีการใช้งานคุกกี้เพื่อประสบการณ์ในการใช้งานเว็บไซต์ที่ดี', en: 'Our website uses cookies for a good user experience.' },
    ClickToViewPrivacyPolicy: { th: 'คลิกเพื่อดูนโยบายส่วนบุคคล', en: 'Click to view privacy policy.' },
    privacyPolicy: { th: 'นโยบายสิทธิส่วนบุคคล', en: 'Privacy Policy' },
    companyProfile: { th: 'โปรไฟล์บริษัท', en: 'Profile Webuild' },
    userAll: { th: 'ผู้ใช้งานทั้งหมด', en: 'User All' },
    partnerShip: { th: 'การร่วมลงทุนระหว่างภาครัฐและภาคเอกชน', en: 'Public Private Partnership' },
    statisticProject: { th: 'สถิติภาพรวมของโครงการ และตัวอย่างผลงานความร่วมมือ', en: 'Overview statistics of project and examples of cooperation results' },
    businessModel: { th: 'ความเชี่ยวชาญของพวกเรา', en: 'Our Expertise' },
    statistics: { th: 'สถิติภาพรวมโครงการความร่วมมือ', en: 'Project Overview statistics and Cooperation results' },
    private: { th: 'ความร่วมมือภาคเอกชนและอื่นๆ', en: 'Private cooperation and others' },
    ourNews: { th: 'ข่าวประชาสัมพันธ์', en: 'Our News' },
    seeAll: { th: 'ดูทั้งหมด', en: 'See All' },
    partnerProject: { th: 'โครงการที่ร่วมมือกับพวกเรา', en: 'Partnership Projects' },
    welcomeTo: { th: 'ยินดีต้อนรับสู่... ', en: 'Welcome to' },
    projectHome: { th: 'ผลงาน', en: 'Project' },
    webuild: { th: 'วี บิลด์ แอนด์ โอเปอร์เรต', en: 'We Build & Operate' },
  }
}

