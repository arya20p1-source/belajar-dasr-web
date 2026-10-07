/**
 * NUSA (NusaBridge) - Platform Ekosistem Ekspor UMKM Indonesia
 * Interactive JavaScript for Sticky Header, Charts, KYC Hub, Auto-Doc, Escrow & Logistics
 */

document.addEventListener('DOMContentLoaded', function () {
    // --------------------------------------------------------------------------
    // 1. STICKY NAVBAR - Menjamin menu tidak tenggelam/hilang saat scroll
    // --------------------------------------------------------------------------
    const navbar = document.querySelector('.nusa-navbar') || document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled', 'shadow-sm');
        } else {
            navbar.classList.remove('navbar-scrolled', 'shadow-sm');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // Smooth scroll for nav items with sticky header offset compensation
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight + 2;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Collapse mobile navbar if open
                const navCollapse = document.getElementById('navbarCollapse');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // Scrollspy highlight active menu item
    const sections = document.querySelectorAll('section[id], div[id].nusa-section');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const navHeight = navbar ? navbar.offsetHeight : 70;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navHeight - 60;
            const sectionId = current.getAttribute('id');
            const targetNavLink = document.querySelector(`.nusa-navbar .nav-link[href*="${sectionId}"]`);

            if (targetNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nusa-navbar .nav-link').forEach(nl => nl.classList.remove('active'));
                    targetNavLink.classList.add('active');
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 2. DIAGRAM BATANG & STATISTIK AGREGAT EKSPOR UMKM DAERAH
    // --------------------------------------------------------------------------
    let exportChartInstance = null;
    const ctxExport = document.getElementById('exportBarChart');

    const regionalExportData = {
        all: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [14.8, 12.6, 9.4, 8.2, 7.5, 6.1, 4.8], // Juta USD
            volumeTon: [1420, 1180, 720, 890, 840, 560, 410]   // Ton
        },
        butter: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [5.8, 4.9, 2.7, 3.1, 2.4, 3.8, 1.2],
            volumeTon: [520, 430, 210, 310, 240, 390, 110]
        },
        spices: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.2, 3.8, 4.5, 2.6, 3.1, 1.2, 2.9],
            volumeTon: [410, 360, 320, 280, 330, 90, 230]
        },
        coffee: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.8, 3.9, 2.2, 2.5, 2.0, 1.1, 0.7],
            volumeTon: [490, 390, 190, 300, 270, 80, 70]
        }
    };

    function renderExportChart(category = 'all') {
        if (!ctxExport) return;
        const data = regionalExportData[category] || regionalExportData.all;

        if (exportChartInstance) {
            exportChartInstance.destroy();
        }

        exportChartInstance = new Chart(ctxExport, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Nilai Ekspor (Juta USD)',
                        data: data.valuesUSD,
                        backgroundColor: 'rgba(15, 118, 110, 0.85)',
                        borderColor: '#0F766E',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Volume Ekspor (Ton)',
                        data: data.volumeTon,
                        backgroundColor: 'rgba(217, 119, 6, 0.75)',
                        borderColor: '#D97706',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Inter', sans-serif", weight: '600', size: 12 },
                            usePointStyle: true,
                            padding: 18
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.datasetIndex === 0) {
                                    label += '$' + context.parsed.y + ' Juta USD';
                                } else {
                                    label += context.parsed.y.toLocaleString() + ' Ton';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: '600' } }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Nilai (Juta USD)', font: { size: 11, weight: '600' } },
                        grid: { color: 'rgba(226, 232, 240, 0.6)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Volume (Ton)', font: { size: 11, weight: '600' } },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    if (ctxExport) {
        renderExportChart('all');
    }

    // Filter Buttons for Export Chart
    const chartFilterBtns = document.querySelectorAll('.chart-filter-btn');
    chartFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            chartFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderExportChart(category);
        });
    });

    // --------------------------------------------------------------------------
    // 3. VISUALISASI DATA & SIMULASI ESCROW
    // --------------------------------------------------------------------------
    let escrowDoughnutInstance = null;
    const ctxEscrow = document.getElementById('escrowMilestoneChart');

    function renderEscrowDoughnut() {
        if (!ctxEscrow) return;
        if (escrowDoughnutInstance) escrowDoughnutInstance.destroy();

        escrowDoughnutInstance = new Chart(ctxEscrow, {
            type: 'doughnut',
            data: {
                labels: [
                    'Tahap 1: Uang Muka Produksi (30%)',
                    'Tahap 2: Hasil Inspeksi Mutu QC (30%)',
                    'Tahap 3: Bea Cukai PEB & Gate-In (20%)',
                    'Tahap 4: B/L On-Board Pelayaran (20%)'
                ],
                datasets: [{
                    data: [30, 30, 20, 20],
                    backgroundColor: [
                        '#0F766E', // Emerald
                        '#14B8A6', // Teal
                        '#F59E0B', // Amber
                        '#3B82F6'  // Blue
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 12,
                            font: { size: 11, weight: '600' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.label}: ${context.raw}% dari Kontrak`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    if (ctxEscrow) {
        renderEscrowDoughnut();
    }

    // Interactive Escrow Simulator Slider
    const escrowSlider = document.getElementById('escrowAmountRange');
    const displayAmount = document.getElementById('escrowDisplayAmount');
    const statDp = document.getElementById('escrowStatDP');
    const statQc = document.getElementById('escrowStatQC');
    const statCustoms = document.getElementById('escrowStatCustoms');
    const statBL = document.getElementById('escrowStatBL');
    const statFee = document.getElementById('escrowStatFee');

    function updateEscrowCalculations(val) {
        const amount = parseInt(val, 10);
        if (displayAmount) displayAmount.textContent = '$' + amount.toLocaleString() + ' USD';
        
        const dp = amount * 0.30;
        const qc = amount * 0.30;
        const customs = amount * 0.20;
        const bl = amount * 0.20;
        const fee = amount * 0.005; // 0.5% fee

        if (statDp) statDp.textContent = '$' + dp.toLocaleString();
        if (statQc) statQc.textContent = '$' + qc.toLocaleString();
        if (statCustoms) statCustoms.textContent = '$' + customs.toLocaleString();
        if (statBL) statBL.textContent = '$' + bl.toLocaleString();
        if (statFee) statFee.textContent = '$' + fee.toLocaleString() + ' (0.5%)';
    }

    if (escrowSlider) {
        escrowSlider.addEventListener('input', function () {
            updateEscrowCalculations(this.value);
        });
        updateEscrowCalculations(escrowSlider.value || 50000);
    }

    // --------------------------------------------------------------------------
    // 4. KYC HUB & VERIFIKASI LEGALITAS (NIB/NPWP)
    // --------------------------------------------------------------------------
    const btnSampleUmkm1 = document.getElementById('btnSampleUmkm1');
    const btnSampleUmkm2 = document.getElementById('btnSampleUmkm2');
    const inputNib = document.getElementById('inputNib');
    const inputNpwp = document.getElementById('inputNpwp');
    const btnVerifyKyc = document.getElementById('btnVerifyKyc');
    const kycResultPlaceholder = document.getElementById('kycResultPlaceholder');
    const kycLoading = document.getElementById('kycLoading');
    const kycResultBox = document.getElementById('kycResultBox');

    if (btnSampleUmkm1) {
        btnSampleUmkm1.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220108740123';
            if (inputNpwp) inputNpwp.value = '81.423.518.2-429.000';
            triggerKycVerification('PT Nusa Java Organik (Artisan Cocoa & Shea Butter)', '0220108740123', '81.423.518.2-429.000', 'Bandung, Jawa Barat', 'KBLI 10732 (Pengolahan Kakao & Mentega Nabati)');
        });
    }

    if (btnSampleUmkm2) {
        btnSampleUmkm2.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220109923841';
            if (inputNpwp) inputNpwp.value = '92.114.823.1-901.000';
            triggerKycVerification('CV Bali Spice & Gourmet Organics', '0220109923841', '92.114.823.1-901.000', 'Gianyar, Bali', 'KBLI 10772 (Industri Rempah & Bumbu Ekspor)');
        });
    }

    if (btnVerifyKyc) {
        btnVerifyKyc.addEventListener('click', function () {
            const nibVal = inputNib ? inputNib.value.trim() : '';
            const npwpVal = inputNpwp ? inputNpwp.value.trim() : '';
            if (!nibVal || !npwpVal) {
                alert('Silakan masukkan nomor NIB dan NPWP atau klik tombol sampel.');
                return;
            }
            triggerKycVerification('PT Nusantara Butter & Agrikultur Terpadu', nibVal, npwpVal, 'Surabaya, Jawa Timur', 'KBLI 10732 (Industri Olahan Lemak & Mentega Nabati)');
        });
    }

    function triggerKycVerification(companyName, nib, npwp, address, kbli) {
        if (kycResultPlaceholder) kycResultPlaceholder.style.display = 'none';
        if (kycResultBox) kycResultBox.style.display = 'none';
        if (kycLoading) kycLoading.style.display = 'block';

        setTimeout(() => {
            if (kycLoading) kycLoading.style.display = 'none';
            if (kycResultBox) {
                kycResultBox.style.display = 'block';
                document.getElementById('resCompanyName').textContent = companyName;
                document.getElementById('resNib').textContent = nib;
                document.getElementById('resNpwp').textContent = npwp;
                document.getElementById('resAddress').textContent = address;
                document.getElementById('resKbli').textContent = kbli;
            }
        }, 800);
    }

    // --------------------------------------------------------------------------
    // 5. AUTO-GENERATE DOCUMENT (RFQ, Proforma Invoice, Sales Contract Incoterms 2020)
    // --------------------------------------------------------------------------
    const btnGenerateDoc = document.getElementById('btnGenerateDoc');
    const docTypeSelect = document.getElementById('docTypeSelect');
    const docExporterInput = document.getElementById('docExporterInput');
    const docBuyerInput = document.getElementById('docBuyerInput');
    const docCommoditySelect = document.getElementById('docCommoditySelect');
    const docVolumeInput = document.getElementById('docVolumeInput');
    const docPriceInput = document.getElementById('docPriceInput');
    const docIncotermSelect = document.getElementById('docIncotermSelect');
    const docPortLoading = document.getElementById('docPortLoading');
    const docPortDischarge = document.getElementById('docPortDischarge');
    const btnPrintDoc = document.getElementById('btnPrintDoc');

    function updateGeneratedDocument() {
        const docType = docTypeSelect ? docTypeSelect.value : 'Proforma Invoice';
        const exporter = docExporterInput ? docExporterInput.value : 'PT Nusa Java Organik';
        const buyer = docBuyerInput ? docBuyerInput.value : 'Bavaria Global Trade GmbH, Hamburg, Germany';
        const commodity = docCommoditySelect ? docCommoditySelect.value : 'Pure Artisan Java Cocoa Butter & Kalimantan Shea Butter';
        const volume = parseFloat(docVolumeInput ? docVolumeInput.value : 5000) || 5000;
        const price = parseFloat(docPriceInput ? docPriceInput.value : 12.50) || 12.50;
        const incoterm = docIncotermSelect ? docIncotermSelect.value : 'FOB Tanjung Priok, Jakarta';
        const pol = docPortLoading ? docPortLoading.value : 'Port of Tanjung Priok, Jakarta (IDTPP)';
        const pod = docPortDischarge ? docPortDischarge.value : 'Port of Hamburg, Germany (DEHAM)';

        const subtotal = volume * price;
        const total = subtotal;

        // Populate preview sheet
        const previewTitle = document.getElementById('docPreviewTitle');
        const previewNumber = document.getElementById('docPreviewNumber');
        const previewDate = document.getElementById('docPreviewDate');
        const previewExporter = document.getElementById('docPreviewExporter');
        const previewBuyer = document.getElementById('docPreviewBuyer');
        const previewIncoterm = document.getElementById('docPreviewIncoterm');
        const previewPOL = document.getElementById('docPreviewPOL');
        const previewPOD = document.getElementById('docPreviewPOD');
        const previewCommodity = document.getElementById('docPreviewCommodity');
        const previewQty = document.getElementById('docPreviewQty');
        const previewPrice = document.getElementById('docPreviewPrice');
        const previewTotal = document.getElementById('docPreviewTotal');
        const previewGrandTotal = document.getElementById('docPreviewGrandTotal');

        if (previewTitle) previewTitle.textContent = docType.toUpperCase();
        if (previewNumber) {
            const prefix = docType.includes('RFQ') ? 'RFQ' : (docType.includes('Invoice') ? 'PI' : 'SC');
            previewNumber.textContent = `${prefix}-NUSA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        if (previewDate) {
            const now = new Date();
            previewDate.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (previewExporter) previewExporter.textContent = exporter;
        if (previewBuyer) previewBuyer.textContent = buyer;
        if (previewIncoterm) previewIncoterm.textContent = incoterm;
        if (previewPOL) previewPOL.textContent = pol;
        if (previewPOD) previewPOD.textContent = pod;
        if (previewCommodity) previewCommodity.textContent = commodity;
        if (previewQty) previewQty.textContent = volume.toLocaleString() + ' Units / Kg';
        if (previewPrice) previewPrice.textContent = '$' + price.toFixed(2) + ' USD';
        if (previewTotal) previewTotal.textContent = '$' + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (previewGrandTotal) previewGrandTotal.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' USD';
    }

    if (btnGenerateDoc) {
        btnGenerateDoc.addEventListener('click', function (e) {
            e.preventDefault();
            updateGeneratedDocument();
            const docPreviewArea = document.getElementById('docPreviewArea');
            if (docPreviewArea) {
                docPreviewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    if (btnPrintDoc) {
        btnPrintDoc.addEventListener('click', function () {
            window.print();
        });
    }

    // --------------------------------------------------------------------------
    // 6. DASHBOARD LOGISTIK & KEPABEANAN (Tracking B/L, PEB/PIB)
    // --------------------------------------------------------------------------
    const btnTrackShipment = document.getElementById('btnTrackShipment');
    const inputTrackingNumber = document.getElementById('inputTrackingNumber');
    const btnSampleBL = document.getElementById('btnSampleBL');
    const btnSamplePEB = document.getElementById('btnSamplePEB');
    const trackingResultBox = document.getElementById('trackingResultBox');

    if (btnSampleBL) {
        btnSampleBL.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'BL-IDN-2026-8890';
            executeTracking('BL-IDN-2026-8890', 'Bill of Lading (B/L)', 'PT Nusa Java Cocoa Butter', 'MV Nusantara Pride Voy 104N', 'Tanjung Priok -> Port of Hamburg', 'Dalam Pelayaran Samudera (In-Transit)');
        });
    }

    if (btnSamplePEB) {
        btnSamplePEB.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'PEB-040300-2026-004123';
            executeTracking('PEB-040300-2026-004123', 'Pemberitahuan Ekspor Barang (PEB)', 'CV Bali Spice Organics', 'KPU Bea dan Cukai Tanjung Perak', 'Surabaya -> Yokohama Port', 'Jalur Hijau (SPE Diterbitkan)');
        });
    }

    if (btnTrackShipment) {
        btnTrackShipment.addEventListener('click', function () {
            const trackVal = inputTrackingNumber ? inputTrackingNumber.value.trim() : '';
            if (!trackVal) {
                alert('Silakan masukkan nomor B/L atau PEB terlebih dahulu.');
                return;
            }
            executeTracking(trackVal, trackVal.startsWith('PEB') ? 'Pemberitahuan Ekspor Barang' : 'Bill of Lading (B/L)', 'UMKM Terverifikasi Nusa', 'MV Meratus Java V-209', 'Tanjung Priok -> Singapore Transshipment', 'Dalam Proses Logistik Terverifikasi');
        });
    }

    function executeTracking(number, type, exporter, carrier, route, statusBadge) {
        if (trackingResultBox) {
            trackingResultBox.style.display = 'block';
            document.getElementById('trackDisplayNumber').textContent = number;
            document.getElementById('trackDisplayType').textContent = type;
            document.getElementById('trackDisplayExporter').textContent = exporter;
            document.getElementById('trackDisplayCarrier').textContent = carrier;
            document.getElementById('trackDisplayRoute').textContent = route;
            document.getElementById('trackDisplayStatus').textContent = statusBadge;
        }
    }

    // --------------------------------------------------------------------------
    // 7. ROLE TAB SWITCHER
    // --------------------------------------------------------------------------
    const roleBtns = document.querySelectorAll('.role-pill-btn');
    const roleCards = document.querySelectorAll('.role-content-pane');

    roleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            roleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const targetRole = this.getAttribute('data-role');

            roleCards.forEach(pane => {
                if (pane.getAttribute('id') === `role-${targetRole}`) {
                    pane.style.display = 'block';
                } else {
                    pane.style.display = 'none';
                }
            });
        });
    });

});
