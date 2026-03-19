// DanOff Application Logic
const DATA_VERSION = 2;

const app = {
    lang: 'bs',
    role: null,
    theme: 'light',
    balance: 20,
    used: 0,
    entity: 'fbih', // fbih, rs, brcko
    medicalFile: null,
    currentHapticRequest: null,
    currentUser: null,
    editingRequestId: null,
    users: [],
    editingUserId: null,
    
    // Entity configurations (holidays stored as MM-DD, resolved dynamically)
    entities: {
        fbih: {
            name: 'FBiH',
            totalDays: 20,
            maxCarryOver: 30,
            legalRef: 'Zakon o radu FBiH (Sl.novine FBiH br. 66/16)',
            holidayDays: ['01-01', '01-02', '03-01', '05-01', '05-02', '11-25', '12-25']
        },
        rs: {
            name: 'RS',
            totalDays: 18,
            maxCarryOver: 20,
            legalRef: 'Zakon o radu RS (Službeni glasnik RS br. 103/17)',
            holidayDays: ['01-01', '01-07', '05-01', '05-09', '11-21']
        },
        brcko: {
            name: 'Brčko',
            totalDays: 20,
            maxCarryOver: 25,
            legalRef: 'Zakon o radu Brčko Distrikta',
            holidayDays: ['01-01', '01-02', '05-01', '12-25']
        }
    },

    getEntityHolidays(entity) {
        const year = new Date().getFullYear();
        const defs = this.entities[entity]?.holidayDays || [];
        // Include current and next year so upcoming requests are covered
        const holidays = [];
        [year, year + 1].forEach(y => defs.forEach(md => holidays.push(`${y}-${md}`)));
        return holidays;
    },

    // Translations
    translations: {
        bs: {
            subtitle: 'Sistem za upravljanje godišnjim odmorom',
            employee: 'Zaposlenik',
            employeeDesc: 'Podnesite zahtjev za godišnji odmor',
            manager: 'Menadžer',
            managerDesc: 'Odobrite zahtjeve i upravljajte timom',
            enableNotifications: 'Omogući obavještenja',
            myLeave: 'Moj godišnji',
            daysLeft: 'dana preostalo',
            annualBalance: 'Godišnje stanje',
            totalEntitlement: 'Ukupno: 20 dana | Iskorišteno: 0 dana',
            newRequest: 'Novi zahtjev',
            recentRequests: 'Nedavni zahtjevi',
            noRequests: 'Nema podnesenih zahtjeva',
            teamManagement: 'Upravljanje timom',
            teamActive: '5 aktivnih članova',
            legalReport: 'Izvještaj',
            pending: 'Na čekanju',
            approvedThisMonth: 'Odobreno ovaj mjesec',
            teamCoverage: 'Pokrivenost tima',
            pendingRequests: 'Na čekanju',
            approved: 'Odobreno',
            rejected: 'Odbijeno',
            cancel: 'Otkaži',
            newLeaveRequest: 'Novi zahtjev za odmor',
            submit: 'Pošalji',
            startDate: 'Datum početka',
            endDate: 'Datum završetka',
            totalDays: 'Ukupno dana:',
            holidayWarning: 'Odabrani period uključuje državni praznik. Radni dani će biti automatski preračunati.',
            leaveType: 'Vrsta odmora',
            annual: 'Godišnji',
            sick: 'Bolovanje',
            notes: 'Napomene',
            legalDocument: 'Pravni dokument',
            downloadPdf: 'Preuzmi PDF',
            requestSubmitted: 'Zahtjev uspješno podnesen',
            requestApproved: 'Zahtjev odobren',
            requestRejected: 'Zahtjev odbijen',
            awaitingApproval: 'Čeka na odobrenje',
            approvedStatus: 'Odobreno',
            rejectedStatus: 'Odbijeno',
            days: 'dana',
            from: 'Od',
            to: 'Do',
            employeeInfo: 'Podaci o zaposleniku',
            companyInfo: 'Podaci o poslodavcu',
            documentTitle: 'OBRAZAC O KORIŠTENJU GODIŠNJEG ODMORA',
            legalBasis: 'Pravna osnova: Zakon o radu Federacije Bosne i Hercegovine (Sl.novine FBiH br. 66/16, 67/16, 1/17)',
            articleReference: 'Član 64. - Pravo na godišnji odmor',
            employer: 'Poslodavac',
            employeeName: 'Zaposlenik',
            position: 'Radno mjesto',
            period: 'Period korištenja',
            workingDays: 'Radnih dana',
            signatureEmployee: 'Potpis zaposlenika',
            signatureEmployer: 'Potpis poslodavca / Pečat',
            date: 'Datum',
            generatedBy: 'Dokument generisan putem DanOff sistema',
            logout: 'Odjava',
            logoutSuccess: 'Uspješno ste odjavljeni',
            forecastTitle: 'Predviđanje godišnjeg',
            archivePlaceholder: "Pretraži arhivu (npr. 'august 2023', 'bolovanje')..."
        },
        en: {
            subtitle: 'Annual Leave Management System',
            employee: 'Employee',
            employeeDesc: 'Submit your leave request',
            manager: 'Manager',
            managerDesc: 'Approve requests and manage team',
            enableNotifications: 'Enable Notifications',
            myLeave: 'My Leave',
            daysLeft: 'days left',
            annualBalance: 'Annual Balance',
            totalEntitlement: 'Total: 20 days | Used: 0 days',
            newRequest: 'New Request',
            recentRequests: 'Recent Requests',
            noRequests: 'No requests submitted',
            teamManagement: 'Team Management',
            teamActive: '5 active members',
            legalReport: 'Legal Report',
            pending: 'Pending',
            approvedThisMonth: 'Approved this month',
            teamCoverage: 'Team Coverage',
            pendingRequests: 'Pending',
            approved: 'Approved',
            rejected: 'Rejected',
            cancel: 'Cancel',
            newLeaveRequest: 'New Leave Request',
            submit: 'Submit',
            startDate: 'Start Date',
            endDate: 'End Date',
            totalDays: 'Total days:',
            holidayWarning: 'Selected period includes a public holiday. Working days will be calculated automatically.',
            leaveType: 'Leave Type',
            annual: 'Annual Leave',
            sick: 'Sick Leave',
            notes: 'Notes',
            legalDocument: 'Legal Document',
            downloadPdf: 'Download PDF',
            requestSubmitted: 'Request submitted successfully',
            requestApproved: 'Request approved',
            requestRejected: 'Request rejected',
            awaitingApproval: 'Awaiting approval',
            approvedStatus: 'Approved',
            rejectedStatus: 'Rejected',
            days: 'days',
            from: 'From',
            to: 'To',
            employeeInfo: 'Employee Information',
            companyInfo: 'Employer Information',
            documentTitle: 'ANNUAL LEAVE USAGE FORM',
            legalBasis: 'Legal Basis: Labor Law of the Federation of Bosnia and Herzegovina (Official Gazette of FBiH No. 66/16, 67/16, 1/17)',
            articleReference: 'Article 64 - Right to Annual Leave',
            employer: 'Employer',
            employeeName: 'Employee',
            position: 'Position',
            period: 'Usage Period',
            workingDays: 'Working Days',
            signatureEmployee: 'Employee Signature',
            signatureEmployer: 'Employer Signature / Stamp',
            date: 'Date',
            generatedBy: 'Document generated via DanOff system',
            logout: 'Logout',
            logoutSuccess: 'You have been successfully logged out',
            forecastTitle: 'Leave Forecast',
            archivePlaceholder: "Search archive (e.g. 'august 2023', 'sick leave')..."
        }
    },

    bosnianHolidays: [], // Will be set based on entity

    init() {
        // Load saved data and check authentication
        this.loadData();
        this.checkAuth();
        this.applyTranslations();
        lucide.createIcons();
    },

    checkAuth() {
        // Check URL params for role from login
        const urlParams = new URLSearchParams(window.location.search);
        const roleFromUrl = urlParams.get('role');
        const isAuth = urlParams.get('auth') === 'true';
        
        // Check session
        const session = localStorage.getItem('danoff_session');
        
        if (session) {
            const parsed = JSON.parse(session);
            this.currentUser = parsed.user;
            
            // Load entity from session if available
            if (parsed.entity) {
                this.entity = parsed.entity;
                this.userEntityData = parsed.entityData;
                // Update balance based on entity
                this.balance = this.userEntityData?.days || this.entities[this.entity].totalDays;
                // Populate holidays for this entity (current year)
                this.bosnianHolidays = this.getEntityHolidays(this.entity);
            }
            
            // Update UI with user info
            this.updateUserUI();
            
            // If role passed from login, use it
            if (roleFromUrl && isAuth) {
                // Clear the URL params but keep auth
                const newUrl = window.location.pathname + '?auth=true';
                window.history.replaceState({}, '', newUrl);
                
                // Auto-select role if it matches user's role
                if (this.currentUser.role === roleFromUrl) {
                    setTimeout(() => this.setRole(roleFromUrl), 100);
                }
            }
        }
    },

    updateUserUI() {
        if (!this.currentUser) return;
        
        const user = this.currentUser;
        const initials = user.name.split(' ').map(n => n[0]).join('');
        
        // Update role selection screen
        document.getElementById('user-info-card')?.classList.remove('hidden');
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.position;
        document.getElementById('user-avatar').textContent = initials;
        
        // Show/hide role buttons based on user role
        const btnEmployee = document.getElementById('btn-employee');
        const btnManager = document.getElementById('btn-manager');
        const btnAdmin = document.getElementById('btn-admin');
        
        if (user.role === 'admin') {
            btnAdmin?.classList.remove('hidden');
            btnEmployee?.classList.add('hidden');
            btnManager?.classList.add('hidden');
        } else if (user.role === 'manager') {
            btnManager?.classList.remove('hidden');
            btnEmployee?.classList.add('hidden');
        } else {
            btnEmployee?.classList.remove('hidden');
            btnManager?.classList.add('hidden');
            btnAdmin?.classList.add('hidden');
        }
        
        // Update employee dashboard
        const empAvatar = document.getElementById('employee-avatar');
        const empName = document.getElementById('employee-name');
        const empPosition = document.getElementById('employee-position');
        
        if (empAvatar) empAvatar.textContent = initials;
        if (empName) empName.textContent = user.name;
        if (empPosition) empPosition.textContent = user.position;
        
        // Update manager dashboard
        const mgrAvatar = document.getElementById('manager-avatar');
        const mgrName = document.getElementById('manager-name');
        
        if (mgrAvatar) mgrAvatar.textContent = initials;
        if (mgrName) mgrName.textContent = user.name;
        
        // Update admin dashboard
        const admAvatar = document.getElementById('admin-avatar');
        const admName = document.getElementById('admin-name');
        
        if (admAvatar) admAvatar.textContent = initials;
        if (admName) admName.textContent = user.name;
    },

    logout() {
        try {
            this.showToast(this.t('logout') || 'Odjava', this.t('logoutSuccess') || 'Uspješno ste odjavljeni', 'success');
        } catch (e) {}

        // Only clear auth session — keep danoff_data so requests persist across logins
        localStorage.removeItem('danoff_session');
        this.currentUser = null;
        this.role = null;

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    },

    showAddUserModal() {
        this.showToast('Info', 'Feature: Add new user modal would open here', 'info');
    },

    toggleLanguage() {
        this.lang = this.lang === 'bs' ? 'en' : 'bs';
        document.getElementById('lang-label').textContent = this.lang.toUpperCase();
        this.applyTranslations();
        this.saveData();
    },

    // Entity toggle removed from main app - should only be set at login
    // Entity is determined by user account and stored in session

    applyTranslations() {
        const t = this.translations[this.lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const camelKey = key.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            if (t[camelKey]) el.textContent = t[camelKey];
            else if (t[key]) el.textContent = t[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const camelKey = key.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            if (t[camelKey]) el.placeholder = t[camelKey];
            else if (t[key]) el.placeholder = t[key];
        });
        this.updateDashboard();
    },

    t(key) {
        return this.translations[this.lang][key] || key;
    },

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    setTheme(theme) {
        this.theme = theme;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.saveData();
    },

    setRole(role) {
        // Check if user has permission for this role
        if (this.currentUser && this.currentUser.role !== role && this.currentUser.role !== 'admin') {
            this.showToast('Error', 'Nemate dozvolu za ovu ulogu / You do not have permission for this role', 'error');
            return;
        }
        
        this.role = role;
        document.getElementById('role-selection').classList.add('hidden');

        if (role === 'employee') {
            document.getElementById('employee-dashboard').classList.remove('hidden');
        } else if (role === 'manager') {
            document.getElementById('manager-dashboard').classList.remove('hidden');
        } else if (role === 'admin') {
            document.getElementById('admin-dashboard').classList.remove('hidden');
        }

        // Initialize demo data first, then update dashboard
        if (!this.requests || this.requests.length === 0) {
            this.initializeDemoData();
        } else {
            if (role === 'employee') this.updateEmployeeDashboard();
            else if (role === 'manager') this.updateManagerDashboard();
            else if (role === 'admin') this.updateAdminDashboard();
        }
    },

    getDefaultUsers() {
        return [
            { id: 'EMP001', name: 'Amar Hodžić',  email: 'zaposlenik@danoff.ba', role: 'employee', position: 'Senior Developer' },
            { id: 'MGR001', name: 'Emina Hadžić',  email: 'menadzer@danoff.ba',  role: 'manager',  position: 'Team Lead' },
            { id: 'ADM001', name: 'Admin Sistem',   email: 'admin@danoff.ba',     role: 'admin',    position: 'System Administrator' },
            { id: 'EMP002', name: 'Sara Kovač',     email: 'sara@danoff.ba',      role: 'employee', position: 'UX Designer' },
            { id: 'EMP003', name: 'Ema Hadžić',     email: 'ema@danoff.ba',       role: 'employee', position: 'Project Manager' }
        ];
    },

    updateAdminDashboard() {
        if (!this.users || this.users.length === 0) {
            this.users = this.getDefaultUsers();
            this.saveData();
        }

        const pending  = this.requests?.filter(r => r.status === 'pending')  || [];
        const approved = this.requests?.filter(r => r.status === 'approved') || [];
        const now = new Date();

        document.getElementById('admin-stat-pending').textContent = pending.length;
        document.getElementById('admin-stat-approved').textContent = approved.filter(r => {
            const d = new Date(r.startDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        document.getElementById('admin-entity-display').textContent = this.entities[this.entity].name;

        // Update user count
        const statUsers = document.getElementById('admin-stat-users');
        if (statUsers) statUsers.textContent = this.users.length;

        // Render users table
        const usersList = document.getElementById('admin-users-list');
        if (usersList) {
            const roleLabel  = r => r === 'admin' ? 'Administrator' : r === 'manager' ? 'Menadžer' : 'Zaposlenik';
            const roleColor  = r => r === 'admin'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : r === 'manager'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';

            usersList.innerHTML = this.users.map(u => `
                <tr class="border-b border-gray-100 dark:border-gray-800">
                    <td class="py-3 font-medium">${u.name}</td>
                    <td class="py-3 text-gray-500 text-sm">${u.email}</td>
                    <td class="py-3">
                        <span class="px-2 py-1 rounded-full text-xs ${roleColor(u.role)}">${roleLabel(u.role)}</span>
                    </td>
                    <td class="py-3 text-gray-500 text-sm">${u.position}</td>
                    <td class="py-3 flex gap-3">
                        <button onclick="app.editUser('${u.id}')" class="text-bosnianBlue hover:underline text-sm">Uredi</button>
                        <button onclick="app.deleteUser('${u.id}')" class="text-red-500 hover:underline text-sm">Obriši</button>
                    </td>
                </tr>
            `).join('');
        }

        // Render all requests for admin
        const adminRequests = document.getElementById('admin-requests-list');
        if (adminRequests) {
            const all = this.requests || [];
            if (all.length === 0) {
                adminRequests.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-gray-400">Nema zahtjeva</td></tr>`;
            } else {
                const statusColor = s => s === 'approved' ? 'bg-green-100 text-green-700' : s === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
                const statusLabel = s => s === 'approved' ? 'Odobreno' : s === 'rejected' ? 'Odbijeno' : 'Na čekanju';
                adminRequests.innerHTML = all.map(r => `
                    <tr class="border-b border-gray-100 dark:border-gray-800">
                        <td class="py-3 font-medium text-sm">${r.employee}</td>
                        <td class="py-3 text-sm text-gray-500">${this.formatDate(r.startDate)} – ${this.formatDate(r.endDate)}</td>
                        <td class="py-3 text-sm text-center">${r.days}</td>
                        <td class="py-3 text-sm text-gray-500">${r.type === 'annual' ? 'Godišnji' : r.type === 'sick' ? 'Bolovanje' : 'Ostalo'}</td>
                        <td class="py-3">
                            <span class="px-2 py-1 rounded-full text-xs ${statusColor(r.status)}">${statusLabel(r.status)}</span>
                        </td>
                        <td class="py-3">
                            <div class="flex gap-2">
                                ${r.status === 'pending' ? `
                                    <button onclick="app.adminHandleRequest(${r.id}, 'approved')" class="text-xs bg-green-500 text-white px-2 py-1 rounded-lg ios-button hover:bg-green-600">Odobri</button>
                                    <button onclick="app.adminHandleRequest(${r.id}, 'rejected')" class="text-xs bg-red-500 text-white px-2 py-1 rounded-lg ios-button hover:bg-red-600">Odbij</button>
                                ` : ''}
                                ${r.status === 'approved' ? `
                                    <button onclick="app.viewLegalDocument(${r.id})" class="text-xs bg-bosnianBlue/10 text-bosnianBlue px-2 py-1 rounded-lg ios-button hover:bg-bosnianBlue/20">PDF</button>
                                ` : ''}
                                <button onclick="app.adminDeleteRequest(${r.id})" class="text-xs text-red-400 hover:underline">Obriši</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

        lucide.createIcons();
    },

    showAddUserModal() {
        this.editingUserId = null;
        document.getElementById('user-modal-title').textContent = 'Dodaj korisnika';
        document.getElementById('user-name-input').value = '';
        document.getElementById('user-email-input').value = '';
        document.getElementById('user-email-input').readOnly = false;
        document.getElementById('user-role-input').value = 'employee';
        document.getElementById('user-position-input').value = '';
        this.hideGlobalControls();
        document.getElementById('user-modal').classList.remove('hidden');
    },

    closeUserModal() {
        document.getElementById('user-modal').classList.add('hidden');
        this.showGlobalControls();
        this.editingUserId = null;
    },

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) return;
        this.editingUserId = id;
        document.getElementById('user-modal-title').textContent = 'Uredi korisnika';
        document.getElementById('user-name-input').value = user.name;
        document.getElementById('user-email-input').value = user.email;
        document.getElementById('user-email-input').readOnly = true;
        document.getElementById('user-role-input').value = user.role;
        document.getElementById('user-position-input').value = user.position;
        this.hideGlobalControls();
        document.getElementById('user-modal').classList.remove('hidden');
    },

    deleteUser(id) {
        if (!confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) return;
        this.users = this.users.filter(u => u.id !== id);
        this.saveData();
        this.updateAdminDashboard();
        this.showToast('Korisnik obrisan', 'Korisnik je uspješno uklonjen', 'info');
    },

    saveUser() {
        const name     = document.getElementById('user-name-input').value.trim();
        const email    = document.getElementById('user-email-input').value.trim().toLowerCase();
        const role     = document.getElementById('user-role-input').value;
        const position = document.getElementById('user-position-input').value.trim();

        if (!name || !email || !position) {
            this.showToast('Greška', 'Molimo popunite sva polja', 'error');
            return;
        }

        if (this.editingUserId) {
            const idx = this.users.findIndex(u => u.id === this.editingUserId);
            if (idx !== -1) {
                this.users[idx] = { ...this.users[idx], name, role, position };
            }
            this.showToast('Korisnik ažuriran', name, 'success');
        } else {
            if (this.users.find(u => u.email === email)) {
                this.showToast('Greška', 'Korisnik s tim emailom već postoji', 'error');
                return;
            }
            this.users.push({
                id: 'USR' + Date.now(),
                name, email, role, position
            });
            this.showToast('Korisnik dodan', name, 'success');
        }

        this.saveData();
        this.closeUserModal();
        this.updateAdminDashboard();
    },

    adminHandleRequest(id, status) {
        const req = this.requests.find(r => r.id === id);
        if (!req) return;
        req.status = status;
        req.approvedAt = new Date().toISOString();
        req.approvedBy = 'Admin';
        this.saveData();
        this.updateAdminDashboard();
        this.showToast(
            status === 'approved' ? this.t('requestApproved') : this.t('requestRejected'),
            `${req.employee} – ${req.days} dana`,
            status === 'approved' ? 'success' : 'error'
        );
        if (status === 'approved') setTimeout(() => this.viewLegalDocument(id), 500);
    },

    adminDeleteRequest(id) {
        if (!confirm('Obrisati ovaj zahtjev?')) return;
        this.requests = this.requests.filter(r => r.id !== id);
        this.saveData();
        this.updateAdminDashboard();
        this.showToast('Zahtjev obrisan', '', 'info');
    },

    resetRole() {
        this.role = null;
        document.getElementById('employee-dashboard').classList.add('hidden');
        document.getElementById('manager-dashboard').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
        document.getElementById('role-selection').classList.remove('hidden');
    },

    initializeDemoData() {
        this.requests = [];
        this.saveData();
        this.updateDashboard();
    },

    updateDashboard() {
        if (this.role === 'employee') this.updateEmployeeDashboard();
        if (this.role === 'manager') this.updateManagerDashboard();
        if (this.role === 'admin') this.updateAdminDashboard();
    },

    updateEmployeeDashboard() {
        const container = document.getElementById('employee-requests');
        const myName = this.currentUser?.name || 'Amar Hodžić';
        const myRequests = this.requests?.filter(r => r.employee === myName) || [];
        
        // Count days used (ring fills up from 0)
        const approvedDays = myRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);
        const pendingDays = myRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.days, 0);
        const annualDays = myRequests.filter(r => r.status === 'approved' && r.type === 'annual').reduce((sum, r) => sum + r.days, 0);
        const sickDays = myRequests.filter(r => r.status === 'approved' && r.type === 'sick').reduce((sum, r) => sum + r.days, 0);
        const otherDays = approvedDays - annualDays - sickDays;

        // Ring fills as days are used (visual reference: 30 days = full ring)
        const ringMax = 30;
        const fillPercent = Math.min((approvedDays / ringMax) * 100, 100);

        document.getElementById('days-remaining').textContent = approvedDays;
        const circle = document.getElementById('balance-ring');
        const circumference = 339.292;
        circle.style.strokeDashoffset = circumference - (fillPercent / 100) * circumference;

        // Update breakdown text
        const parts = [];
        if (annualDays > 0) parts.push(this.lang === 'bs' ? `Godišnji: ${annualDays}` : `Annual: ${annualDays}`);
        if (sickDays > 0) parts.push(this.lang === 'bs' ? `Bolovanje: ${sickDays}` : `Sick: ${sickDays}`);
        if (otherDays > 0) parts.push(this.lang === 'bs' ? `Ostalo: ${otherDays}` : `Other: ${otherDays}`);
        if (pendingDays > 0) parts.push(this.lang === 'bs' ? `Na čekanju: ${pendingDays}` : `Pending: ${pendingDays}`);
        const entitlementEl = document.getElementById('total-entitlement');
        if (entitlementEl) entitlementEl.textContent = parts.length ? parts.join(' | ') : (this.lang === 'bs' ? 'Nema iskorištenih dana' : 'No days used yet');

        // Update labels based on language
        const daysUsedLabel = document.getElementById('days-used-label');
        if (daysUsedLabel) daysUsedLabel.textContent = this.lang === 'bs' ? 'dana iskorišteno' : 'days used';
        const balanceTitle = document.getElementById('balance-title');
        if (balanceTitle) balanceTitle.textContent = this.lang === 'bs' ? 'Korišteni dani' : 'Days Used';

        // Update request count badge
        const countEl = document.getElementById('request-count');
        if (countEl) countEl.textContent = `(${myRequests.length})`;

        // Render forecast chart
        this.renderForecastChart(myRequests);

        // Render requests
        if (myRequests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                    <p>${this.t('noRequests')}</p>
                </div>
            `;
        } else {
            container.innerHTML = myRequests.map(req => this.createRequestCard(req)).join('');
        }
        
        lucide.createIcons();
    },

    createRequestCard(req) {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        };
        
        const statusText = {
            pending: this.t('awaitingApproval'),
            approved: this.t('approvedStatus'),
            rejected: this.t('rejectedStatus')
        };

        return `
            <div class="glass rounded-2xl p-4 kanban-card border border-gray-200 dark:border-gray-800">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status]} mb-2">
                            ${statusText[req.status]}
                        </span>
                        <h4 class="font-semibold text-lg">${req.days} ${this.t('days')}</h4>
                    </div>
                    <div class="text-right text-sm text-gray-500 dark:text-gray-400">
                        ${req.type === 'annual' ? this.t('annual') : this.t('sick')}
                    </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    <span>${this.formatDate(req.startDate)} - ${this.formatDate(req.endDate)}</span>
                </div>
                ${req.notes ? `<p class="text-sm text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">${req.notes}</p>` : ''}
                ${req.status === 'pending' ? `
                    <div class="flex gap-3 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button onclick="app.editRequest(${req.id})" class="flex items-center gap-1 text-sm text-bosnianBlue hover:underline">
                            <i data-lucide="pencil" class="w-3 h-3"></i>
                            ${this.lang === 'bs' ? 'Uredi' : 'Edit'}
                        </button>
                        <button onclick="app.cancelRequest(${req.id})" class="flex items-center gap-1 text-sm text-red-500 hover:underline">
                            <i data-lucide="x" class="w-3 h-3"></i>
                            ${this.lang === 'bs' ? 'Otkaži zahtjev' : 'Cancel request'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    },

    updateManagerDashboard() {
        const pending = this.requests?.filter(r => r.status === 'pending') || [];
        const approved = this.requests?.filter(r => r.status === 'approved') || [];
        const rejected = this.requests?.filter(r => r.status === 'rejected') || [];
        
        document.getElementById('stat-pending').textContent = pending.length;
        document.getElementById('stat-approved').textContent = approved.filter(r => {
            const date = new Date(r.startDate);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        const totalApprovedDays = approved.reduce((sum, r) => sum + r.days, 0);
        const statCostEl = document.getElementById('stat-cost');
        if (statCostEl) statCostEl.textContent = `${totalApprovedDays * 100} KM`;
        
        document.getElementById('count-pending').textContent = pending.length;
        document.getElementById('count-approved').textContent = approved.length;
        document.getElementById('count-rejected').textContent = rejected.length;
        
        document.getElementById('kanban-pending').innerHTML = pending.map(req => this.createManagerCard(req)).join('') || 
            `<div class="text-center py-8 text-gray-400 text-sm">${this.t('noRequests')}</div>`;
        document.getElementById('kanban-approved').innerHTML = approved.map(req => this.createManagerCard(req)).join('') || 
            `<div class="text-center py-8 text-gray-400 text-sm">${this.t('noRequests')}</div>`;
        document.getElementById('kanban-rejected').innerHTML = rejected.map(req => this.createManagerCard(req)).join('') || 
            `<div class="text-center py-8 text-gray-400 text-sm">${this.t('noRequests')}</div>`;
        
        lucide.createIcons();
    },

    createManagerCard(req) {
        return `
            <div class="glass rounded-xl p-4 kanban-card border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h4 class="font-semibold">${req.employee}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${req.position}</p>
                    </div>
                    <span class="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        ${req.days} dana
                    </span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div class="flex items-center gap-2 mb-1">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span>${this.formatDate(req.startDate)} - ${this.formatDate(req.endDate)}</span>
                    </div>
                </div>
                ${req.status === 'pending' ? `
                    <div class="flex gap-2 mt-3">
                        <button onclick="app.handleRequest(${req.id}, 'approved')" class="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium ios-button hover:bg-green-600">
                            ${this.t('approved')}
                        </button>
                        <button onclick="app.handleRequest(${req.id}, 'rejected')" class="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium ios-button hover:bg-red-600">
                            ${this.t('rejected')}
                        </button>
                    </div>
                ` : ''}
                ${req.status === 'approved' ? `
                    <button onclick="app.viewLegalDocument(${req.id})" class="w-full mt-3 bg-bosnianBlue/10 text-bosnianBlue py-2 rounded-lg text-sm font-medium ios-button hover:bg-bosnianBlue/20 flex items-center justify-center gap-2">
                        <i data-lucide="file-text" class="w-4 h-4"></i>
                        ${this.t('legalDocument')}
                    </button>
                ` : ''}
            </div>
        `;
    },

    hideGlobalControls() {
        document.getElementById('global-controls')?.classList.add('hidden');
    },

    showGlobalControls() {
        document.getElementById('global-controls')?.classList.remove('hidden');
    },

    openRequestSheet() {
        this.hideGlobalControls();
        const sheet = document.getElementById('request-sheet');
        sheet.classList.remove('hidden');
        setTimeout(() => {
            sheet.querySelector('.sheet-modal').classList.remove('translate-y-full');
        }, 10);

        // Initialize Flatpickr with DD/MM/YYYY display format
        const fpConfig = {
            dateFormat: 'Y-m-d',       // internal value stays YYYY-MM-DD
            altInput: true,
            altFormat: 'd/m/Y',        // displayed as DD/MM/YYYY
            allowInput: false,
            onChange: () => this.calculateDays()
        };

        if (this._fpStart) this._fpStart.destroy();
        if (this._fpEnd) this._fpEnd.destroy();
        this._fpStart = flatpickr('#start-date', fpConfig);
        this._fpEnd   = flatpickr('#end-date',   fpConfig);

        // Set default dates
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        this._fpStart.setDate(today, true);
        this._fpEnd.setDate(nextWeek, true);
        this.calculateDays();
    },

    closeRequestSheet() {
        this.showGlobalControls();
        const sheet = document.getElementById('request-sheet');
        const modal = sheet.querySelector('.sheet-modal');
        modal.classList.add('translate-y-full');
        setTimeout(() => {
            sheet.classList.add('hidden');
        }, 300);
        this.editingRequestId = null;
    },

    calculateDays() {
        const start = new Date(document.getElementById('start-date').value);
        const end = new Date(document.getElementById('end-date').value);
        
        if (start && end && end >= start) {
            let workingDays = 0;
            let current = new Date(start);
            let hasHoliday = false;
            
            while (current <= end) {
                const day = current.getDay();
                const dateStr = current.toISOString().split('T')[0];
                
                if (day !== 0 && day !== 6 && !this.bosnianHolidays.includes(dateStr)) {
                    workingDays++;
                }
                if (this.bosnianHolidays.includes(dateStr)) {
                    hasHoliday = true;
                }
                current.setDate(current.getDate() + 1);
            }
            
            document.getElementById('calculated-days').textContent = workingDays;
            document.getElementById('holiday-warning').classList.toggle('hidden', !hasHoliday);
        } else {
            document.getElementById('calculated-days').textContent = '0';
        }
    },

    submitRequest() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const days = parseInt(document.getElementById('calculated-days').textContent);
        const type = document.querySelector('input[name="leave-type"]:checked').value;
        const notes = document.getElementById('request-notes').value;

        if (!startDate || !endDate || days === 0) {
            this.showToast('Error', this.lang === 'bs' ? 'Odaberite ispravne datume' : 'Please select valid dates', 'error');
            return;
        }

        if (this.editingRequestId) {
            // Update existing pending request
            const idx = this.requests.findIndex(r => r.id === this.editingRequestId);
            if (idx !== -1) {
                this.requests[idx] = {
                    ...this.requests[idx],
                    startDate, endDate, days, type, notes,
                    updatedAt: new Date().toISOString()
                };
            }
            this.editingRequestId = null;
            this.showToast(this.lang === 'bs' ? 'Zahtjev ažuriran' : 'Request updated', `${days} ${this.t('days')}`, 'success');
        } else {
            // New request
            const userName = this.currentUser ? this.currentUser.name : 'Amar Hodžić';
            const userPosition = this.currentUser ? this.currentUser.position : 'Senior Developer';

            this.requests = this.requests || [];
            this.requests.push({
                id: Date.now(),
                employee: userName,
                position: userPosition,
                startDate, endDate, days, type,
                status: 'pending',
                notes,
                submittedAt: new Date().toISOString()
            });
            this.showToast(this.t('requestSubmitted'), `${days} ${this.t('days')}`, 'success');
        }

        this.saveData();
        this.updateEmployeeDashboard();
        this.closeRequestSheet();
        document.getElementById('request-notes').value = '';
    },

    cancelRequest(id) {
        this.requests = this.requests.filter(r => r.id !== id);
        this.saveData();
        this.updateEmployeeDashboard();
        this.showToast(
            this.lang === 'bs' ? 'Zahtjev otkazan' : 'Request cancelled',
            this.lang === 'bs' ? 'Zahtjev za odmor je uklonjen' : 'Leave request has been removed',
            'info'
        );
    },

    editRequest(id) {
        const req = this.requests.find(r => r.id === id);
        if (!req || req.status !== 'pending') return;

        this.editingRequestId = id;
        this.openRequestSheet();

        setTimeout(() => {
            if (this._fpStart) this._fpStart.setDate(req.startDate, true);
            if (this._fpEnd) this._fpEnd.setDate(req.endDate, true);
            document.getElementById('request-notes').value = req.notes || '';
            const typeRadio = document.querySelector(`input[name="leave-type"][value="${req.type}"]`);
            if (typeRadio) typeRadio.checked = true;
            this.calculateDays();
        }, 100);
    },

    handleRequest(id, status) {
        const req = this.requests.find(r => r.id === id);
        if (req) {
            req.status = status;
            req.approvedAt = new Date().toISOString();
            req.approvedBy = 'Manager';
            this.saveData();
            this.updateManagerDashboard();
            this.showToast(
                status === 'approved' ? this.t('requestApproved') : this.t('requestRejected'),
                `${req.employee} - ${req.days} days`,
                status === 'approved' ? 'success' : 'error'
            );
            
            // Generate PDF for approved requests
            if (status === 'approved') {
                setTimeout(() => this.viewLegalDocument(id), 500);
            }
        }
    },

    viewLegalDocument(requestId) {
        const req = this.requests.find(r => r.id === requestId);
        if (!req) return;
        
        const modal = document.getElementById('pdf-modal');
        const content = document.getElementById('pdf-content');
        
        const isBS = this.lang === 'bs';
        const docTitle = isBS ? this.t('documentTitle') : this.t('documentTitle');
        
        content.innerHTML = `
            <div class="border-2 border-gray-800 p-8 min-h-[800px]">
                <div class="text-center mb-8">
                    <h1 class="text-xl font-bold mb-2 uppercase tracking-wide">${docTitle}</h1>
                    <p class="text-xs text-gray-600">${this.t('legalBasis')}</p>
                    <p class="text-xs text-gray-600">${this.t('articleReference')}</p>
                </div>
                
                <div class="mb-8">
                    <h2 class="font-bold border-b border-gray-800 pb-1 mb-3 uppercase text-sm">${this.t('companyInfo')}</h2>
                    <p class="text-sm"><strong>${this.t('employer')}:</strong> TechCompany d.o.o. Sarajevo</p>
                    <p class="text-sm"><strong>ID:</strong> 1234567890001</p>
                    <p class="text-sm"><strong>Adresa:</strong> Zmaja od Bosne 10, 71000 Sarajevo</p>
                </div>
                
                <div class="mb-8">
                    <h2 class="font-bold border-b border-gray-800 pb-1 mb-3 uppercase text-sm">${this.t('employeeInfo')}</h2>
                    <p class="text-sm"><strong>${this.t('employeeName')}:</strong> ${req.employee}</p>
                    <p class="text-sm"><strong>${this.t('position')}:</strong> ${req.position}</p>
                    <p class="text-sm"><strong>JMBG:</strong> 1234567890123</p>
                </div>
                
                <div class="mb-8">
                    <h2 class="font-bold border-b border-gray-800 pb-1 mb-3 uppercase text-sm">${this.t('period')}</h2>
                    <table class="w-full text-sm border-collapse">
                        <tr class="border-b border-gray-300">
                            <td class="py-2 font-medium">${this.t('from')}:</td>
                            <td class="py-2">${this.formatDate(req.startDate)}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="py-2 font-medium">${this.t('to')}:</td>
                            <td class="py-2">${this.formatDate(req.endDate)}</td>
                        </tr>
                        <tr class="border-b border-gray-300">
                            <td class="py-2 font-medium">${this.t('workingDays')}:</td>
                            <td class="py-2 font-bold">${req.days}</td>
                        </tr>
                        <tr>
                            <td class="py-2 font-medium">Vrsta odmora / Type:</td>
                            <td class="py-2">${req.type === 'annual' ? 'Godišnji odmor / Annual Leave' : 'Bolovanje / Sick Leave'}</td>
                        </tr>
                    </table>
                </div>
                
                ${req.notes ? `
                    <div class="mb-8">
                        <h2 class="font-bold border-b border-gray-800 pb-1 mb-3 uppercase text-sm">Napomene / Notes</h2>
                        <p class="text-sm italic">${req.notes}</p>
                    </div>
                ` : ''}
                
                <div class="mt-12 grid grid-cols-2 gap-8">
                    <div class="border-t border-gray-800 pt-2">
                        <p class="text-xs uppercase mb-8">${this.t('signatureEmployee')}</p>
                        <p class="text-xs">${this.t('date')}: _______________</p>
                    </div>
                    <div class="border-t border-gray-800 pt-2">
                        <p class="text-xs uppercase mb-8">${this.t('signatureEmployer')}</p>
                        <p class="text-xs">${this.t('date')}: ${this.formatDate(new Date().toISOString())}</p>
                    </div>
                </div>
                
                <div class="mt-12 pt-4 border-t border-gray-400 text-center">
                    <p class="text-xs text-gray-500">${this.t('generatedBy')}</p>
                    <p class="text-xs text-gray-400 mt-1">ID: ${req.id}-${Date.now()}</p>
                </div>
            </div>
        `;
        
        this.currentPdfContent = content.innerHTML;
        this.currentPdfData = req;

        this.hideGlobalControls();
        modal.classList.remove('hidden');
    },

    closePdfModal() {
        document.getElementById('pdf-modal').classList.add('hidden');
        this.showGlobalControls();
    },

    downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add Bosnian font support (using default with unicode approximation)
        doc.setFont('helvetica');
        
        const req = this.currentPdfData;
        const isBS = this.lang === 'bs';
        
        let y = 20;
        
        // Title
        doc.setFontSize(16);
        doc.text(isBS ? 'OBRAZAC O KORIŠTENJU GODIŠNJEG ODMORA' : 'ANNUAL LEAVE USAGE FORM', 105, y, { align: 'center' });
        y += 10;
        
        doc.setFontSize(10);
        doc.text(this.t('legalBasis'), 105, y, { align: 'center', maxWidth: 180 });
        y += 15;
        
        // Company Info
        doc.setFontSize(12);
        doc.text(this.t('companyInfo'), 20, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(`${this.t('employer')}: TechCompany d.o.o. Sarajevo`, 20, y);
        y += 6;
        doc.text('ID: 1234567890001', 20, y);
        y += 15;
        
        // Employee Info
        doc.setFontSize(12);
        doc.text(this.t('employeeInfo'), 20, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(`${this.t('employeeName')}: ${req.employee}`, 20, y);
        y += 6;
        doc.text(`${this.t('position')}: ${req.position}`, 20, y);
        y += 15;
        
        // Period
        doc.setFontSize(12);
        doc.text(this.t('period'), 20, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(`${this.t('from')}: ${this.formatDate(req.startDate)}`, 20, y);
        y += 6;
        doc.text(`${this.t('to')}: ${this.formatDate(req.endDate)}`, 20, y);
        y += 6;
        doc.text(`${this.t('workingDays')}: ${req.days}`, 20, y);
        y += 20;
        
        // Signatures
        doc.line(20, y, 80, y);
        doc.line(110, y, 170, y);
        y += 5;
        doc.setFontSize(9);
        doc.text(this.t('signatureEmployee'), 20, y);
        doc.text(this.t('signatureEmployer'), 110, y);
        
        doc.save(`Godisnji_Odmor_${req.employee}_${req.startDate}.pdf`);
    },

    generateLegalReport() {
        this.showToast('Izvještaj generisan', 'PDF izvještaj je preuzet', 'success');
        // In a real app, this would generate a comprehensive PDF report
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(this.lang === 'bs' ? 'bs-BA' : 'en-GB', options);
    },

    showToast(title, message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const titleEl = document.getElementById('toast-title');
        const msgEl = document.getElementById('toast-message');
        const iconContainer = toast.querySelector('.w-10.h-10');
        
        titleEl.textContent = title;
        msgEl.textContent = message;
        
        // Reset icon - replace with fresh i element since Lucide replaces it with SVG
        const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'bell';
        iconContainer.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
        lucide.createIcons();
        
        toast.classList.remove('opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
    },

    requestNotificationPermission() {
        if (!('Notification' in window)) {
            this.showToast('Error', 'Notifications not supported', 'error');
            return;
        }
        
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                this.showToast('Success', 'Notifications enabled', 'success');
                new Notification('DanOff', {
                    body: this.lang === 'bs' ? 'Obavještenja su omogućena!' : 'Notifications enabled!',
                    icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png'
                });
            }
        });
    },

    saveData() {
        const data = {
            version: DATA_VERSION,
            lang: this.lang,
            theme: this.theme,
            requests: this.requests,
            users: this.users,
            balance: this.balance,
            used: this.used,
            entity: this.entity,
            entityData: this.userEntityData
        };
        localStorage.setItem('danoff_data', JSON.stringify(data));
    },

    loadData() {
        const saved = localStorage.getItem('danoff_data');
        if (saved) {
            const data = JSON.parse(saved);

            // If data version is outdated, discard old requests (clears demo data)
            if (data.version !== DATA_VERSION) {
                localStorage.removeItem('danoff_data');
                return;
            }

            this.lang = data.lang || 'bs';
            this.theme = data.theme || 'light';
            this.requests = data.requests || [];
            this.users    = data.users    || this.getDefaultUsers();
            this.balance = data.balance || 0;
            this.used = data.used || 0;
            this.entity = data.entity || 'fbih';
            this.userEntityData = data.entityData || null;

            document.getElementById('lang-label').textContent = this.lang.toUpperCase();
            if (this.theme === 'dark') {
                document.documentElement.classList.add('dark');
            }
        }
    },

    renderForecastChart(myRequests) {
        const chart = document.getElementById('forecast-chart');
        if (!chart) return;
        const months = Array(12).fill(0);
        (myRequests || []).filter(r => r.status === 'approved').forEach(r => {
            const month = new Date(r.startDate).getMonth();
            months[month] += r.days;
        });
        const maxVal = Math.max(...months, 1);
        chart.innerHTML = months.map(val => {
            const height = Math.max((val / maxVal) * 100, 4);
            return `<div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-xs text-gray-400">${val > 0 ? val : ''}</span>
                <div class="w-full rounded-t-md ${val > 0 ? 'bg-bosnianBlue' : 'bg-gray-200 dark:bg-gray-700'}" style="height: ${height}%"></div>
            </div>`;
        }).join('');
    },

    searchArchive(query) {
        const container = document.getElementById('employee-requests');
        const myName = this.currentUser?.name || 'Amar Hodžić';
        const allRequests = this.requests?.filter(r => r.employee === myName) || [];

        if (!query) {
            this.updateEmployeeDashboard();
            return;
        }

        const q = query.toLowerCase();
        const filtered = allRequests.filter(r =>
            r.startDate.includes(q) ||
            r.endDate.includes(q) ||
            r.type.toLowerCase().includes(q) ||
            (r.notes && r.notes.toLowerCase().includes(q)) ||
            r.status.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            container.innerHTML = `<div class="text-center py-12 text-gray-400"><p>Nema rezultata pretrage</p></div>`;
        } else {
            container.innerHTML = filtered.map(req => this.createRequestCard(req)).join('');
        }
        lucide.createIcons();
    },

    showEmergencyContact() {
        this.showToast('Hitni kontakt', 'Sara Kovač: +387 61 123 456', 'info');
    },

    showTeamHeatmap() {
        this.hideGlobalControls();
        const modal = document.getElementById('heatmap-modal');
        if (!modal) return;
        this.renderTeamHeatmap();
        modal.classList.remove('hidden');
    },

    closeTeamHeatmap() {
        this.showGlobalControls();
        document.getElementById('heatmap-modal')?.classList.add('hidden');
    },

    renderTeamHeatmap() {
        const container = document.getElementById('team-heatmap');
        if (!container) return;
        const today = new Date();
        const days = [];
        for (let i = 0; i < 28; i++) {
            const d = new Date(today.getTime() + i * 86400000);
            const dateStr = d.toISOString().split('T')[0];
            const count = (this.requests || []).filter(r =>
                r.status === 'approved' && r.startDate <= dateStr && r.endDate >= dateStr
            ).length;
            days.push({ dateStr, count, label: d.getDate() });
        }
        container.innerHTML = days.map(({ count, label }) => {
            const color = count === 0 ? 'bg-green-100' : count <= 2 ? 'bg-yellow-200' : 'bg-red-400';
            return `<div class="${color} rounded p-2 text-center text-xs font-medium">${label}</div>`;
        }).join('');
    },

    showTeamAvailability() {
        this.hideGlobalControls();
        const modal = document.getElementById('availability-modal');
        if (!modal) return;
        this.renderTeamAvailability();
        modal.classList.remove('hidden');
    },

    closeTeamAvailability() {
        this.showGlobalControls();
        document.getElementById('availability-modal')?.classList.add('hidden');
    },

    renderTeamAvailability() {
        const container = document.getElementById('availability-list');
        if (!container) return;
        const today = new Date().toISOString().split('T')[0];
        const team = [
            { name: 'Amar Hodžić', position: 'Senior Developer' },
            { name: 'Sara Kovač', position: 'UX Designer' },
            { name: 'Ema Hadžić', position: 'Project Manager' },
            { name: 'Marko Petrović', position: 'DevOps' },
            { name: 'Emina Hadžić', position: 'Team Lead' }
        ];
        container.innerHTML = team.map(member => {
            const onLeave = (this.requests || []).some(r =>
                r.employee === member.name && r.status === 'approved' &&
                r.startDate <= today && r.endDate >= today
            );
            const initials = member.name.split(' ').map(n => n[0]).join('');
            return `<div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">${initials}</div>
                    <div>
                        <p class="font-medium text-sm">${member.name}</p>
                        <p class="text-xs text-gray-500">${member.position}</p>
                    </div>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${onLeave ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                    ${onLeave ? 'Na odmoru' : 'Na poslu'}
                </span>
            </div>`;
        }).join('');
    },

    openVacationTrade() {
        this.hideGlobalControls();
        document.getElementById('trade-modal')?.classList.remove('hidden');
    },

    closeVacationTrade() {
        this.showGlobalControls();
        document.getElementById('trade-modal')?.classList.add('hidden');
    },

    proposeTrade() {
        const partner = document.getElementById('trade-partner')?.value;
        const give = document.getElementById('trade-give')?.value;
        const receive = document.getElementById('trade-receive')?.value;
        if (!partner) {
            this.showToast('Greška', 'Odaberite kolegu', 'error');
            return;
        }
        this.closeVacationTrade();
        this.showToast('Zamjena poslana', `Prijedlog zamjene: ${give} → ${receive} dana`, 'success');
    },

    showBurnoutDetails() {
        this.showToast('Zdravlje tima', 'Svi članovi tima su u dobrom stanju. Nema znakova preopterećenosti.', 'info');
    },

    dismissAIWarning() {
        document.getElementById('ai-conflict-warning')?.classList.add('hidden');
    },

    closeDynamicIsland() {
        const island = document.getElementById('dynamic-island');
        if (island) {
            island.style.opacity = '0';
            island.style.pointerEvents = 'none';
        }
    },

    hapticAction(action) {
        document.getElementById('haptic-menu')?.classList.add('hidden');
        if (action === 'extend') {
            this.openRequestSheet();
        } else if (action === 'cancel') {
            this.showToast('Otkazano', 'Zahtjev za odmor je otkazan', 'info');
        } else if (action === 'pdf') {
            if (this.currentHapticRequest) {
                this.viewLegalDocument(this.currentHapticRequest);
            }
        }
    },

    simulateBiometricAuth() {
        const modal = document.getElementById('biometric-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        this.showToast('Autentifikacija uspješna', 'Biometrijska potvrda prihvaćena', 'success');
    },

    toggleFocusMode() {
        const focusMode = document.getElementById('focus-mode');
        const focusToggle = document.getElementById('focus-toggle');
        if (!focusMode) return;
        if (focusMode.classList.contains('hidden')) {
            this.hideGlobalControls();
            focusMode.classList.remove('hidden');
            focusMode.classList.add('flex');
            focusToggle?.classList.remove('hidden');
        } else {
            this.showGlobalControls();
            focusMode.classList.add('hidden');
            focusMode.classList.remove('flex');
        }
    },

    exportToCalendar() {
        if (!this.currentPdfData) {
            this.showToast('Greška', 'Nema podataka za izvoz', 'error');
            return;
        }
        const req = this.currentPdfData;
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${req.startDate.replace(/-/g, '')}`,
            `DTEND:${req.endDate.replace(/-/g, '')}`,
            `SUMMARY:Godišnji odmor - ${req.employee}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');
        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'odmor.ics';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('iCal', 'Kalendar je preuzet', 'success');
    },

    shareWhatsApp() {
        if (!this.currentPdfData) {
            this.showToast('Greška', 'Nema podataka za dijeljenje', 'error');
            return;
        }
        const req = this.currentPdfData;
        const text = encodeURIComponent(
            `Godišnji odmor: ${req.employee}\nOd: ${this.formatDate(req.startDate)}\nDo: ${this.formatDate(req.endDate)}\nDana: ${req.days}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    exportEGovernment() {
        this.showToast('e-Građani', 'Izvoz za e-Građani portal je u razvoju', 'info');
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});