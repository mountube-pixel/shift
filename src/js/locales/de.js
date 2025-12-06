// src/js/locales/de.js
export default {
  translation: {
    common: {
      welcome: "Willkommen zurück",
      logout: "Abmelden",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      email: "E-Mail",
      password: "Passwort",
      error: "Fehler",
      success: "Erfolg",
      loading: "Laden..."
    },
    login: {
      title: "Anmelden",
      subtitle: "Geben Sie Ihre Anmeldedaten ein",
      cta: "Jetzt Anmelden",
      forgot_pass: "Passwort vergessen?",
      contact_admin: "Kontaktieren Sie Ihre Organisation."
    },
    home: {
      greeting_morning: "Guten Morgen",
      greeting_afternoon: "Guten Tag",
      greeting_evening: "Guten Abend",
      total_hours: "Gesamtstunden",
      status: "Status",
      start_shift: "SCHICHT BEGINNEN",
      gps_ready: "GPS-Ortung aktiv",
      next_shifts: "Nächste Schichten",
      no_shifts: "Keine Schichten geplant",
      view_all: "Alle ansehen"
    },
    admin: {
      title: "Kontrollraum",
      dashboard: "Dashboard",
      users: "Benutzer",
      orgs: "Organisationen",
      settings: "Einstellungen"
    },
    
    // --- DASHBOARD ENTE ---
    org_dashboard: {
        title: "Organisationsverwaltung",
        subtitle: "Aktivitätenübersicht",
        loading: "Datenanalyse läuft...",
        quick_actions: "Schnellaktionen",
        recent_activity: "Letzte Aktivitäten",
        panel_control: "Kontrollpanel",
        
        // Buttons
        btn_new_project: "Neues Projekt",
        btn_approve: "Stunden genehmigen",
        btn_volunteers: "Freiwillige",
        btn_settings: "Konfigurieren",
        
        // KPI
        kpi_projects: "Aktive Projekte",
        kpi_projects_sub: "Laufend",
        kpi_hours: "Genehmigungen",
        kpi_hours_sub: "Wartende Stunden",
        kpi_volunteers: "Freiwillige",
        kpi_volunteers_sub: "Registriert"
    },

    users: {
        title: "Benutzerverwaltung",
        search_placeholder: "Freiwilligen suchen...",
        table_name: "Name",
        table_role: "Rolle",
        table_status: "Status",
        table_location: "Zone",
        role_volunteer: "Freiwilliger",
        role_admin: "Admin",
        role_super_admin: "Super User",
        status_active: "Aktiv",
        status_suspended: "Gesperrt",
        btn_add: "Neuer Benutzer",
        
        form: {
            title_new: "Neuer Benutzer",
            first_name: "Vorname",
            last_name: "Nachname",
            city: "Stadt",
            province: "Provinz (Kürzel)",
            role_select: "Rolle wählen",
            password_placeholder: "Vorläufiges Passwort",
            save: "Benutzer speichern"
        }
    },
    orgs: {
        title: "Organisationsverwaltung",
        btn_add: "Neue Organisation",
        table_name: "Organisation",
        table_plan: "Plan",
        table_stats: "Statistik",
        table_status: "Status",
        form: {
            title_new: "Organisation registrieren",
            tab_info: "Daten",
            tab_details: "Details & Web",
            tab_admin: "Erster Administrator",
            
            name: "Firmenname",
            vat: "USt-IdNr. / Steuernummer",
            city: "Stadt (Sitz)",
            prov: "Prov.",
            address: "Rechtliche Adresse",
            
            sector: "Sektor",
            color: "Markenfarbe",
            logo: "Logo-URL",
            description: "Beschreibung",
            president: "Präsident",
            website: "Webseite",
            social: "Soziale Seite (FB/IG)",
            phone: "Öffentliches Telefon",
            public_email: "Öffentliche E-Mail",
            
            admin_fn: "Vorname Admin",
            admin_ln: "Nachname Admin",
            admin_email: "E-Mail Login",
            admin_pass: "Passwort"
        }
    }
  }
};