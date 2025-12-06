// src/js/locales/it.js
export default {
  translation: {
    common: {
      welcome: "Bentornato",
      logout: "Disconnetti",
      cancel: "Annulla",
      confirm: "Conferma",
      email: "Email",
      password: "Password",
      error: "Errore",
      success: "Successo",
      loading: "Caricamento..."
    },
    login: {
      title: "Accedi",
      subtitle: "Inserisci le tue credenziali",
      cta: "Accedi Ora",
      forgot_pass: "Password dimenticata?",
      contact_admin: "Contatta la tua associazione."
    },
    home: {
      greeting_morning: "Buongiorno",
      greeting_afternoon: "Buon pomeriggio",
      greeting_evening: "Buonasera",
      total_hours: "Totale Ore",
      status: "Status",
      start_shift: "INIZIA TURNO",
      gps_ready: "Rilevamento GPS attivo",
      next_shifts: "Prossimi Turni",
      no_shifts: "Nessun turno in programma",
      view_all: "Vedi tutti"
    },
    admin: {
      title: "Control Room",
      dashboard: "Dashboard",
      users: "Utenti",
      orgs: "Associazioni",
      settings: "Impostazioni"
    },
    
    // --- NUOVA SEZIONE: Dashboard Ente ---
    org_dashboard: {
        title: "Gestione Associazione",
        subtitle: "Panoramica delle attività",
        loading: "Analisi dati in corso...",
        quick_actions: "Azioni Rapide",
        recent_activity: "Attività Recente",
        panel_control: "Pannello di Controllo",
        
        // Bottoni
        btn_new_project: "Nuovo Progetto",
        btn_approve: "Approva Ore",
        btn_volunteers: "Volontari",
        btn_settings: "Configura",
        
        // KPI
        kpi_projects: "Progetti Attivi",
        kpi_projects_sub: "In corso",
        kpi_hours: "Approvazioni",
        kpi_hours_sub: "Ore in attesa",
        kpi_volunteers: "Volontari",
        kpi_volunteers_sub: "Registrati"
    },

    users: {
        title: "Gestione Utenti",
        search_placeholder: "Cerca volontario...",
        table_name: "Nome",
        table_role: "Ruolo",
        table_status: "Stato",
        table_location: "Zona",
        role_volunteer: "Volontario",
        role_admin: "Admin",
        role_super_admin: "Super User",
        status_active: "Attivo",
        status_suspended: "Sospeso",
        btn_add: "Nuovo Utente",
        
        form: {
            title_new: "Nuovo Utente",
            first_name: "Nome",
            last_name: "Cognome",
            city: "Città",
            province: "Provincia (Sigla)",
            role_select: "Seleziona Ruolo",
            password_placeholder: "Password provvisoria",
            save: "Salva Utente"
        }
    },
    orgs: {
        title: "Gestione Associazioni",
        btn_add: "Nuova Associazione",
        table_name: "Ente",
        table_plan: "Piano",
        table_stats: "Statistiche",
        table_status: "Stato",
        form: {
            title_new: "Registra Ente",
            tab_info: "Dati Ente",
            tab_details: "Dettagli & Web",
            tab_admin: "Primo Amministratore",
            
            name: "Ragione Sociale",
            vat: "P.IVA / C.F.",
            city: "Città Sede",
            prov: "Prov.",
            address: "Indirizzo Legale",
            
            sector: "Settore",
            color: "Colore Brand",
            logo: "URL Logo",
            description: "Descrizione",
            president: "Presidente",
            website: "Sito Web",
            social: "Pagina Social (FB/IG)",
            phone: "Telefono Pubblico",
            public_email: "Email Pubblica",
            
            admin_fn: "Nome Admin",
            admin_ln: "Cognome Admin",
            admin_email: "Email Login",
            admin_pass: "Password"
        }
    }
  }
};