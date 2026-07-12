--
-- PostgreSQL database dump
--

\restrict wEZvLm2oPgabtFdzotYlU7lj9YoQ92acSzHvklzkxlGAYmee1u1B69h3Ce2o6go

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: case_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.case_status AS ENUM (
    'pending',
    'hearing',
    'decided',
    'appealed',
    'closed',
    'stayed'
);


--
-- Name: case_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.case_type AS ENUM (
    'civil',
    'criminal',
    'writ',
    'arbitration',
    'consumer',
    'revenue',
    'other'
);


--
-- Name: charge_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.charge_status AS ENUM (
    'pending',
    'paid',
    'overdue',
    'waived'
);


--
-- Name: employee_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employee_category AS ENUM (
    'regular',
    'contract',
    'daily_wage',
    'deputation'
);


--
-- Name: employee_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employee_status AS ENUM (
    'active',
    'retired',
    'resigned',
    'terminated',
    'on_leave'
);


--
-- Name: employee_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employee_type AS ENUM (
    'officer',
    'other'
);


--
-- Name: finance_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.finance_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: grievance_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.grievance_category AS ENUM (
    'property',
    'maintenance',
    'allotment',
    'construction',
    'water_sewage',
    'road',
    'park',
    'corruption',
    'service_delay',
    'other'
);


--
-- Name: grievance_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.grievance_status AS ENUM (
    'submitted',
    'acknowledged',
    'in_progress',
    'resolved',
    'closed',
    'rejected'
);


--
-- Name: payroll_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_status AS ENUM (
    'draft',
    'processed',
    'paid',
    'revised'
);


--
-- Name: property_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.property_status AS ENUM (
    'available',
    'allotted',
    'cancelled',
    'transferred',
    'disputed'
);


--
-- Name: property_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.property_type AS ENUM (
    'residential',
    'commercial',
    'industrial',
    'plot'
);


--
-- Name: scheme_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.scheme_type AS ENUM (
    'scheme',
    'survey'
);


--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transaction_type AS ENUM (
    'receipt',
    'payment'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'superadmin',
    'admin',
    'officer',
    'user'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: allowance_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allowance_heads (
    id integer NOT NULL,
    name text NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: allowance_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.allowance_heads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: allowance_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.allowance_heads_id_seq OWNED BY public.allowance_heads.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title text NOT NULL,
    title_hindi text,
    subtitle text,
    description text,
    image_url text,
    bg_gradient text DEFAULT 'from-slate-900 to-teal-800'::text NOT NULL,
    link_url text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: budget_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.budget_heads (
    id integer NOT NULL,
    head_code text NOT NULL,
    head_name text NOT NULL,
    major_head text,
    minor_head text,
    fy_year text NOT NULL,
    allocated_amount numeric(15,2) DEFAULT '0'::numeric,
    revised_amount numeric(15,2) DEFAULT '0'::numeric,
    spent_amount numeric(15,2) DEFAULT '0'::numeric,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: budget_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.budget_heads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: budget_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.budget_heads_id_seq OWNED BY public.budget_heads.id;


--
-- Name: court_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.court_cases (
    id integer NOT NULL,
    case_no text NOT NULL,
    case_title text NOT NULL,
    court text NOT NULL,
    case_type public.case_type DEFAULT 'civil'::public.case_type NOT NULL,
    petitioner text,
    respondent text,
    filing_date date,
    advocate text,
    advocate_phone text,
    next_hearing date,
    status public.case_status DEFAULT 'pending'::public.case_status NOT NULL,
    subject text,
    last_order_date date,
    last_order_summary text,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: court_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.court_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: court_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.court_cases_id_seq OWNED BY public.court_cases.id;


--
-- Name: da_master; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.da_master (
    id integer NOT NULL,
    paybill_group text NOT NULL,
    da_from date,
    da_upto date,
    da_percent numeric(6,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: da_master_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.da_master_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: da_master_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.da_master_id_seq OWNED BY public.da_master.id;


--
-- Name: deduction_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deduction_heads (
    id integer NOT NULL,
    name text NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: deduction_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deduction_heads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deduction_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deduction_heads_id_seq OWNED BY public.deduction_heads.id;


--
-- Name: employee_allowances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_allowances (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    allowance_head_id integer NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    is_applicable boolean DEFAULT true NOT NULL
);


--
-- Name: employee_allowances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_allowances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employee_allowances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_allowances_id_seq OWNED BY public.employee_allowances.id;


--
-- Name: employee_deductions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_deductions (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    deduction_head_id integer NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    is_applicable boolean DEFAULT true NOT NULL
);


--
-- Name: employee_deductions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_deductions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employee_deductions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_deductions_id_seq OWNED BY public.employee_deductions.id;


--
-- Name: employee_leaves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_leaves (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    leave_head_id integer NOT NULL,
    days numeric(6,2) DEFAULT 0 NOT NULL,
    is_applicable boolean DEFAULT true NOT NULL
);


--
-- Name: employee_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employee_leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employee_leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employee_leaves_id_seq OWNED BY public.employee_leaves.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    emp_code text NOT NULL,
    name text NOT NULL,
    father_name text,
    designation text NOT NULL,
    department text NOT NULL,
    category public.employee_category DEFAULT 'regular'::public.employee_category NOT NULL,
    join_date date,
    retirement_date date,
    phone text,
    email text,
    address text,
    pan_no text,
    gpf_no text,
    basic_pay numeric(12,2),
    grade text,
    bank_account text,
    bank_name text,
    ifsc text,
    status public.employee_status DEFAULT 'active'::public.employee_status NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    employee_type public.employee_type DEFAULT 'other'::public.employee_type NOT NULL,
    sex text DEFAULT 'M'::text,
    dob date,
    doa date,
    pay_level text,
    gis_lic_no text,
    centralized boolean DEFAULT false,
    branch_sol_id text,
    pf_account text,
    cpf_account text,
    cbo_reg_no text,
    pran text,
    marital_status text DEFAULT 'Unmarried'::text,
    aadhar_card text,
    last_qualification text,
    emp_group text,
    paybill_group text,
    contribution_type text DEFAULT 'GPF'::text,
    incr_month text,
    incr_percent text,
    is_nps_deduction boolean DEFAULT false,
    photo_url text,
    signature_url text,
    is_suspended boolean DEFAULT false,
    is_retired boolean DEFAULT false,
    is_disabled boolean DEFAULT false,
    is_transferred boolean DEFAULT false,
    is_pensionable boolean DEFAULT false
);


--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: finance_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_transactions (
    id integer NOT NULL,
    voucher_no text NOT NULL,
    transaction_date date NOT NULL,
    type public.transaction_type NOT NULL,
    budget_head_id integer,
    head_code text,
    amount numeric(15,2) NOT NULL,
    description text NOT NULL,
    party_name text,
    cheque_no text,
    bank_name text,
    status public.finance_status DEFAULT 'pending'::public.finance_status NOT NULL,
    approved_by text,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: finance_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_transactions_id_seq OWNED BY public.finance_transactions.id;


--
-- Name: grievance_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grievance_roles (
    id integer NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: grievance_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grievance_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grievance_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grievance_roles_id_seq OWNED BY public.grievance_roles.id;


--
-- Name: grievance_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grievance_sections (
    id integer NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: grievance_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grievance_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grievance_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grievance_sections_id_seq OWNED BY public.grievance_sections.id;


--
-- Name: grievance_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grievance_subjects (
    id integer NOT NULL,
    subject text NOT NULL,
    section_id integer,
    role_id integer,
    officer_name text,
    officer_mobile text,
    officer_email text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: grievance_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grievance_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grievance_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grievance_subjects_id_seq OWNED BY public.grievance_subjects.id;


--
-- Name: grievances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grievances (
    id integer NOT NULL,
    ticket_no text NOT NULL,
    applicant_name text NOT NULL,
    mobile text NOT NULL,
    email text,
    address text,
    category public.grievance_category DEFAULT 'other'::public.grievance_category NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    attachment_url text,
    status public.grievance_status DEFAULT 'submitted'::public.grievance_status NOT NULL,
    assigned_to text,
    assigned_department text,
    resolution text,
    resolved_date text,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: grievances_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grievances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grievances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grievances_id_seq OWNED BY public.grievances.id;


--
-- Name: leave_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_heads (
    id integer NOT NULL,
    name text NOT NULL,
    default_days numeric(6,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: leave_heads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_heads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_heads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_heads_id_seq OWNED BY public.leave_heads.id;


--
-- Name: lic_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lic_entries (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    emp_code text,
    emp_name text NOT NULL,
    policy_no text NOT NULL,
    premium_amount numeric(12,2) DEFAULT 0 NOT NULL,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: lic_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lic_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lic_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lic_entries_id_seq OWNED BY public.lic_entries.id;


--
-- Name: maintenance_charges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance_charges (
    id integer NOT NULL,
    property_no text NOT NULL,
    owner_name text NOT NULL,
    sector text,
    plot_no text,
    charge_year integer NOT NULL,
    charge_month integer,
    amount numeric(12,2) NOT NULL,
    penalty_amount numeric(12,2) DEFAULT '0'::numeric,
    due_date date,
    paid_date date,
    receipt_no text,
    payment_mode text,
    status public.charge_status DEFAULT 'pending'::public.charge_status NOT NULL,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    charge_from_date date,
    charge_to_date date
);


--
-- Name: maintenance_charges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_charges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_charges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_charges_id_seq OWNED BY public.maintenance_charges.id;


--
-- Name: maintenance_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance_properties (
    id integer NOT NULL,
    property_no text NOT NULL,
    owner_name text NOT NULL,
    owner_phone text,
    owner_email text,
    sector text,
    colony_name text,
    plot_no text,
    flat_no text,
    property_type text DEFAULT 'residential'::text NOT NULL,
    area numeric(10,2),
    allotment_date date,
    address text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_possession boolean DEFAULT false NOT NULL,
    possession_date date,
    is_developed boolean DEFAULT false NOT NULL,
    developed_date date,
    property_code text,
    father_name text,
    layout_no text,
    category text,
    sector_block text,
    final_registry_date date,
    is_cancelled boolean DEFAULT false NOT NULL
);


--
-- Name: maintenance_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_properties_id_seq OWNED BY public.maintenance_properties.id;


--
-- Name: maintenance_rate_slabs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance_rate_slabs (
    id integer NOT NULL,
    property_type text NOT NULL,
    description text,
    rate_per_sqft numeric(10,2),
    minimum_charge numeric(12,2),
    effective_from date,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_developed boolean DEFAULT false NOT NULL,
    effective_to date
);


--
-- Name: maintenance_rate_slabs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_rate_slabs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_rate_slabs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_rate_slabs_id_seq OWNED BY public.maintenance_rate_slabs.id;


--
-- Name: maintenance_receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance_receipts (
    id integer NOT NULL,
    charge_id integer NOT NULL,
    receipt_no text NOT NULL,
    paid_amount numeric(12,2) NOT NULL,
    paid_date date NOT NULL,
    payment_mode text NOT NULL,
    transaction_ref text,
    collected_by text,
    remarks text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: maintenance_receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.maintenance_receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: maintenance_receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.maintenance_receipts_id_seq OWNED BY public.maintenance_receipts.id;


--
-- Name: marquee_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.marquee_items (
    id integer NOT NULL,
    title text NOT NULL,
    file_url text,
    file_type text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: marquee_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marquee_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marquee_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marquee_items_id_seq OWNED BY public.marquee_items.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    is_tender boolean DEFAULT false NOT NULL,
    last_date date,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: officials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.officials (
    id integer NOT NULL,
    name text NOT NULL,
    designation text NOT NULL,
    department text DEFAULT ''::text NOT NULL,
    photo_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: officials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.officials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: officials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.officials_id_seq OWNED BY public.officials.id;


--
-- Name: payroll_banks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_banks (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_banks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_banks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_banks_id_seq OWNED BY public.payroll_banks.id;


--
-- Name: payroll_branches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_branches (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_branches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_branches_id_seq OWNED BY public.payroll_branches.id;


--
-- Name: payroll_designations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_designations (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_designations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_designations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_designations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_designations_id_seq OWNED BY public.payroll_designations.id;


--
-- Name: payroll_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_groups (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_groups_id_seq OWNED BY public.payroll_groups.id;


--
-- Name: payroll_house_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_house_types (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_house_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_house_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_house_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_house_types_id_seq OWNED BY public.payroll_house_types.id;


--
-- Name: payroll_paybill_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_paybill_groups (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_paybill_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_paybill_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_paybill_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_paybill_groups_id_seq OWNED BY public.payroll_paybill_groups.id;


--
-- Name: payroll_qualifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_qualifications (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payroll_qualifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_qualifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_qualifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_qualifications_id_seq OWNED BY public.payroll_qualifications.id;


--
-- Name: payroll_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_records (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    emp_code text NOT NULL,
    emp_name text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    basic_pay numeric(12,2) DEFAULT '0'::numeric,
    da numeric(12,2) DEFAULT '0'::numeric,
    gross_pay numeric(12,2) DEFAULT '0'::numeric,
    total_deductions numeric(12,2) DEFAULT '0'::numeric,
    net_pay numeric(12,2) DEFAULT '0'::numeric,
    status public.payroll_status DEFAULT 'draft'::public.payroll_status NOT NULL,
    paid_date text,
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    employer_nps numeric(12,2) DEFAULT 0,
    worked_days integer,
    month_days integer DEFAULT 30,
    total_allowances numeric(12,2) DEFAULT 0,
    allowances_data jsonb DEFAULT '[]'::jsonb,
    deductions_data jsonb DEFAULT '[]'::jsonb
);


--
-- Name: payroll_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payroll_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payroll_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payroll_records_id_seq OWNED BY public.payroll_records.id;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photos (
    id integer NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    property_no text NOT NULL,
    applicant_name text NOT NULL,
    father_name text,
    address text,
    phone text,
    email text,
    scheme text,
    sector text,
    plot_no text,
    area numeric(10,2),
    area_unit text DEFAULT 'sqmt'::text,
    type public.property_type DEFAULT 'residential'::public.property_type NOT NULL,
    status public.property_status DEFAULT 'available'::public.property_status NOT NULL,
    allotment_date date,
    registry_date date,
    total_cost numeric(15,2),
    remarks text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: scheme_display_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scheme_display_cards (
    id integer NOT NULL,
    section text NOT NULL,
    title text NOT NULL,
    image_url text,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: scheme_display_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scheme_display_cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: scheme_display_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scheme_display_cards_id_seq OWNED BY public.scheme_display_cards.id;


--
-- Name: schemes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schemes (
    id integer NOT NULL,
    type public.scheme_type DEFAULT 'scheme'::public.scheme_type NOT NULL,
    title text NOT NULL,
    title_hindi text,
    description text,
    description_hindi text,
    image_url text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    fees numeric(12,2),
    fees_label text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    booklet_url text,
    is_open_for_registration boolean DEFAULT false NOT NULL
);


--
-- Name: schemes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schemes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schemes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schemes_id_seq OWNED BY public.schemes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    email text,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    department text,
    designation text,
    phone text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    title text NOT NULL,
    video_url text NOT NULL,
    thumbnail_url text,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: whats_new; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whats_new (
    id integer NOT NULL,
    content text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: whats_new_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.whats_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whats_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.whats_new_id_seq OWNED BY public.whats_new.id;


--
-- Name: allowance_heads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allowance_heads ALTER COLUMN id SET DEFAULT nextval('public.allowance_heads_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: budget_heads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_heads ALTER COLUMN id SET DEFAULT nextval('public.budget_heads_id_seq'::regclass);


--
-- Name: court_cases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.court_cases ALTER COLUMN id SET DEFAULT nextval('public.court_cases_id_seq'::regclass);


--
-- Name: da_master id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.da_master ALTER COLUMN id SET DEFAULT nextval('public.da_master_id_seq'::regclass);


--
-- Name: deduction_heads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deduction_heads ALTER COLUMN id SET DEFAULT nextval('public.deduction_heads_id_seq'::regclass);


--
-- Name: employee_allowances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_allowances ALTER COLUMN id SET DEFAULT nextval('public.employee_allowances_id_seq'::regclass);


--
-- Name: employee_deductions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_deductions ALTER COLUMN id SET DEFAULT nextval('public.employee_deductions_id_seq'::regclass);


--
-- Name: employee_leaves id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leaves ALTER COLUMN id SET DEFAULT nextval('public.employee_leaves_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: finance_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_transactions ALTER COLUMN id SET DEFAULT nextval('public.finance_transactions_id_seq'::regclass);


--
-- Name: grievance_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_roles ALTER COLUMN id SET DEFAULT nextval('public.grievance_roles_id_seq'::regclass);


--
-- Name: grievance_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_sections ALTER COLUMN id SET DEFAULT nextval('public.grievance_sections_id_seq'::regclass);


--
-- Name: grievance_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_subjects ALTER COLUMN id SET DEFAULT nextval('public.grievance_subjects_id_seq'::regclass);


--
-- Name: grievances id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievances ALTER COLUMN id SET DEFAULT nextval('public.grievances_id_seq'::regclass);


--
-- Name: leave_heads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_heads ALTER COLUMN id SET DEFAULT nextval('public.leave_heads_id_seq'::regclass);


--
-- Name: lic_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lic_entries ALTER COLUMN id SET DEFAULT nextval('public.lic_entries_id_seq'::regclass);


--
-- Name: maintenance_charges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_charges ALTER COLUMN id SET DEFAULT nextval('public.maintenance_charges_id_seq'::regclass);


--
-- Name: maintenance_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_properties ALTER COLUMN id SET DEFAULT nextval('public.maintenance_properties_id_seq'::regclass);


--
-- Name: maintenance_rate_slabs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_rate_slabs ALTER COLUMN id SET DEFAULT nextval('public.maintenance_rate_slabs_id_seq'::regclass);


--
-- Name: maintenance_receipts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_receipts ALTER COLUMN id SET DEFAULT nextval('public.maintenance_receipts_id_seq'::regclass);


--
-- Name: marquee_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marquee_items ALTER COLUMN id SET DEFAULT nextval('public.marquee_items_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: officials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.officials ALTER COLUMN id SET DEFAULT nextval('public.officials_id_seq'::regclass);


--
-- Name: payroll_banks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_banks ALTER COLUMN id SET DEFAULT nextval('public.payroll_banks_id_seq'::regclass);


--
-- Name: payroll_branches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_branches ALTER COLUMN id SET DEFAULT nextval('public.payroll_branches_id_seq'::regclass);


--
-- Name: payroll_designations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_designations ALTER COLUMN id SET DEFAULT nextval('public.payroll_designations_id_seq'::regclass);


--
-- Name: payroll_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_groups ALTER COLUMN id SET DEFAULT nextval('public.payroll_groups_id_seq'::regclass);


--
-- Name: payroll_house_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_house_types ALTER COLUMN id SET DEFAULT nextval('public.payroll_house_types_id_seq'::regclass);


--
-- Name: payroll_paybill_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_paybill_groups ALTER COLUMN id SET DEFAULT nextval('public.payroll_paybill_groups_id_seq'::regclass);


--
-- Name: payroll_qualifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_qualifications ALTER COLUMN id SET DEFAULT nextval('public.payroll_qualifications_id_seq'::regclass);


--
-- Name: payroll_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records ALTER COLUMN id SET DEFAULT nextval('public.payroll_records_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: scheme_display_cards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheme_display_cards ALTER COLUMN id SET DEFAULT nextval('public.scheme_display_cards_id_seq'::regclass);


--
-- Name: schemes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schemes ALTER COLUMN id SET DEFAULT nextval('public.schemes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Name: whats_new id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whats_new ALTER COLUMN id SET DEFAULT nextval('public.whats_new_id_seq'::regclass);


--
-- Data for Name: allowance_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.allowance_heads (id, name, amount, is_active, created_at) FROM stdin;
1	Allowance	0.00	t	2026-07-11 10:25:01.151132
2	Washing Allowance	0.00	t	2026-07-11 10:25:48.575464
3	Medical Allowance	0.00	t	2026-07-11 10:26:02.362834
4	Handicap Allowance	0.00	t	2026-07-11 10:26:17.901288
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, title_hindi, subtitle, description, image_url, bg_gradient, link_url, is_active, display_order, created_at, updated_at) FROM stdin;
2		\N	\N	\N	https://bdainfo.org/Webmedia/BDA03.jpg	from-slate-900 to-teal-800	https://bdainfo.org/Webmedia/BDA03.jpg	t	2	2026-06-27 20:09:06.49585+00	2026-07-04 17:12:39.771+00
3		\N	\N	\N	https://bdainfo.org/Webmedia/ramayanvatika.png	from-slate-900 to-teal-800	https://bdainfo.org/Webmedia/ramayanvatika.png	t	3	2026-06-27 20:12:09.747441+00	2026-07-04 17:12:53.962+00
1		\N	\N	\N	https://bdainfo.org/Webmedia/BDA02.jpg	from-slate-900 to-teal-800	https://bdainfo.org/Webmedia/BDA02.jpg	t	1	2026-06-27 20:07:39.898597+00	2026-07-04 17:13:04.705+00
\.


--
-- Data for Name: budget_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.budget_heads (id, head_code, head_name, major_head, minor_head, fy_year, allocated_amount, revised_amount, spent_amount, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: court_cases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.court_cases (id, case_no, case_title, court, case_type, petitioner, respondent, filing_date, advocate, advocate_phone, next_hearing, status, subject, last_order_date, last_order_summary, remarks, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: da_master; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.da_master (id, paybill_group, da_from, da_upto, da_percent, is_active, created_at, updated_at) FROM stdin;
1	Officer	2026-01-01	2026-10-31	60.00	t	2026-07-11 14:40:27.616236	2026-07-11 14:40:27.616236
2	Employees	2026-01-01	2026-10-31	60.00	t	2026-07-11 14:40:59.693248	2026-07-11 14:40:59.693248
3	Officer	2025-07-01	2025-12-31	58.00	t	2026-07-11 14:41:40.501436	2026-07-11 14:41:40.501436
4	Employees	2025-07-01	2025-12-31	58.00	t	2026-07-11 14:42:36.043974	2026-07-11 14:42:36.043974
5	Officer	2025-01-01	2025-06-30	56.00	t	2026-07-11 14:43:14.240424	2026-07-11 14:43:14.240424
6	Employees	2025-01-01	2025-06-30	56.00	t	2026-07-11 14:43:49.221427	2026-07-11 14:43:49.221427
\.


--
-- Data for Name: deduction_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deduction_heads (id, name, amount, is_active, created_at) FROM stdin;
1	Income Tax	0.00	t	2026-07-11 10:27:32.229414
2	Vehicle Deduction	0.00	t	2026-07-11 10:27:50.699585
3	House Rent Deduction	0.00	t	2026-07-11 10:28:10.236737
4	GVR	0.00	t	2026-07-11 10:28:22.71314
\.


--
-- Data for Name: employee_allowances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_allowances (id, employee_id, allowance_head_id, amount, is_applicable) FROM stdin;
1	101	1	0.00	f
2	101	2	0.00	f
3	101	3	0.00	f
4	101	4	0.00	f
5	2	1	0.00	f
6	2	2	0.00	f
7	2	3	3000.00	t
8	2	4	0.00	f
13	1	1	0.00	f
14	1	2	0.00	f
15	1	3	0.00	f
16	1	4	0.00	f
21	4	1	0.00	f
22	4	2	0.00	f
23	4	3	0.00	f
24	4	4	0.00	f
25	105	1	0.00	f
26	105	2	0.00	f
27	105	3	0.00	f
28	105	4	0.00	f
17	3	1	1000.00	t
18	3	2	2000.00	t
19	3	3	3000.00	t
20	3	4	4000.00	t
\.


--
-- Data for Name: employee_deductions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_deductions (id, employee_id, deduction_head_id, amount, is_applicable) FROM stdin;
1	101	1	0.00	f
2	101	2	0.00	f
3	101	3	0.00	f
4	101	4	0.00	f
5	2	1	10000.00	t
6	2	2	800.00	t
7	2	3	520.00	t
8	2	4	0.00	f
13	1	1	0.00	f
14	1	2	0.00	f
15	1	3	0.00	f
16	1	4	0.00	f
21	4	1	0.00	f
22	4	2	0.00	f
23	4	3	0.00	f
24	4	4	0.00	f
25	105	1	0.00	f
26	105	2	0.00	f
27	105	3	0.00	f
28	105	4	0.00	f
17	3	1	10000.00	t
18	3	2	5000.00	t
19	3	3	6000.00	t
20	3	4	800.00	t
\.


--
-- Data for Name: employee_leaves; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_leaves (id, employee_id, leave_head_id, days, is_applicable) FROM stdin;
1	101	1	10.00	f
2	101	2	15.00	f
3	2	1	30.00	t
4	2	2	15.00	t
7	1	1	10.00	f
8	1	2	15.00	f
11	4	1	10.00	f
12	4	2	15.00	f
13	105	1	10.00	f
14	105	2	15.00	f
9	3	1	10.00	f
10	3	2	15.00	f
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, emp_code, name, father_name, designation, department, category, join_date, retirement_date, phone, email, address, pan_no, gpf_no, basic_pay, grade, bank_account, bank_name, ifsc, status, is_active, created_at, updated_at, employee_type, sex, dob, doa, pay_level, gis_lic_no, centralized, branch_sol_id, pf_account, cpf_account, cbo_reg_no, pran, marital_status, aadhar_card, last_qualification, emp_group, paybill_group, contribution_type, incr_month, incr_percent, is_nps_deduction, photo_url, signature_url, is_suspended, is_retired, is_disabled, is_transferred, is_pensionable) FROM stdin;
19	1284790	SURJEET SINGH	\N	Surveyor	Administration	regular	2007-10-04	2037-12-25	9568006714	\N	\N	CUNPS0770A	\N	39200.00	\N	1870000400502726	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.004927	other	M	1977-12-26	\N	5	\N	\N	187000	1870007700002105	1870007700002114	6595746	6595746	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
22	1284804	MOHD. JELANI	\N	Driver	Nazarat	regular	2010-12-24	2028-05-23	9568006416	\N	\N	CTRPK4939C	\N	33300.00	\N	1870000400505079	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.015263	other	M	1968-05-24	\N	4	\N	\N	187000	1870007700001009	1870007700001018	6595746	110125108172	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
30	1284871	SERVESH PAL	\N	W/MAN	Administration	regular	2010-12-27	2031-01-09	9568006722	\N	\N	\N	\N	29300.00	\N	1870000100514173	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.038714	other	M	1971-01-10	\N	2	\N	\N	187000	1870007700001814	1870007700001823	6595746	110125729833	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
38	1284933	NIRMALA	\N	Mali	Horticulture	regular	2018-12-04	2039-07-10	9568006469	\N	\N	\N	\N	22100.00	\N	1870000100535024	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.079822	other	M	1979-07-11	\N	1	\N	\N	187000	1870007700002886	1870007700002895	6595746	110165125440	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
46	1284964	VINOD KUMAR	\N	SUPERVISOR	Administration	regular	2010-12-24	2026-07-14	7500295265	\N	\N	\N	\N	29300.00	\N	1870000400505033	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.10545	other	M	1966-07-15	\N	2	\N	\N	187000	1870007700002248	1870007700002257	6595746	111105108201	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
55	1285615	MOHIT KUMAR	\N	Clerk	Administration	regular	2018-11-19	2052-10-23	9568006422	\N	\N	BLTPM7464H	\N	25200.00	\N	1870000100541210	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.131711	other	M	1992-10-24	\N	2	\N	\N	187000	1870007700002734	1870007700002752	6595746	110155125429	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
57	1295137	ADYA PRASAD NARAYAN SINGH	\N	Ex. Engg.	Engineering	regular	2003-01-01	2026-03-25	\N	\N	\N	AXQPS2911P	\N	112400.00	\N	18730110003374	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.137093	other	M	1966-03-26	\N	12	\N	t	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
58	1296121	LALTA PRASAD	\N	Mali	Horticulture	regular	2010-12-24	2027-11-14	9568006420	\N	\N	\N	\N	29300.00	\N	1870000400505273	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.139493	other	M	1967-11-15	\N	2	\N	\N	187000	1870007700000824	1870007700000833	6595746	110115125384	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
66	1349504	DILEEP KUMAR	\N	Peon	Nazarat	regular	2008-12-16	2050-11-08	9568006484	\N	\N	\N	\N	32000.00	\N	1870000400504089	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.16402	other	M	1990-11-09	\N	2	\N	\N	187000	1870007700000426	1870007700000426	6595746	110145682737	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
72	1350437	SANTOSH KUMAR	\N	Clerk	Administration	regular	2007-10-01	2038-01-14	9568006707	\N	\N	DMSPK6859J	\N	39200.00	\N	1870000400502674	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.185502	other	M	1978-01-15	\N	4	\N	\N	187000	\N	1870007700001753	6595746	110168231353	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
81	1681697	AJAY KUMAR YADAV	\N	A.E.	Engineering	regular	2023-05-03	2056-10-09	8272080603	\N	\N	BEVPY2243D	\N	61300.00	\N	1870000100584987	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.212425	other	M	1996-10-10	\N	10	\N	\N	187000	\N	\N	6595746	6595746	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
88	2029089	BAUDDHA MANI GAUTAM	\N	J.E.	Engineering	regular	2024-10-16	2057-06-24	7233881868	\N	\N	DXRPG6943K	\N	36500.00	\N	6846001500006051	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.235575	other	M	1997-06-25	\N	6	\N	\N	684600	\N	\N	6595746	110199644292	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
97	1284604	RAJESH KUMAR SHARMA	\N	J.E.	Engineering	regular	2004-10-14	2025-05-17	\N	\N	\N	BHSPS2189C	\N	71100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.265911	other	M	1965-05-18	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
84	1684114	YASHODA	\N	Mali	Horticulture	regular	2023-03-22	2039-12-31	7351218414	\N	\N	\N	\N	19100.00	\N	1870000100583340	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.221391	other	M	1980-01-01	\N	1	\N	\N	187000	\N	\N	6595746	110187752660	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
85	2028169	BIJENDRA SINGH	\N	JR CLERK	Administration	regular	2024-09-17	2050-07-07	8077575927	\N	\N	\N	\N	20500.00	\N	1870000100590401	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.225125	other	M	1990-07-08	\N	2	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
86	2028261	AJIT KUMAR SAHANI	\N	J.E.	Engineering	regular	2024-09-06	2053-10-14	7380603277	\N	\N	\N	\N	36500.00	\N	1259000102468402	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.229889	other	M	1993-10-15	\N	6	\N	\N	187000	\N	\N	6595746	111202434891	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
87	2028281	SEETARAM	\N	J.E.	Engineering	regular	2024-09-25	2056-05-31	9935762975	\N	\N	\N	\N	36500.00	\N	1870000100590359	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.233059	other	M	1996-06-01	\N	6	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
89	2035619	SANDEEP KUMAR II	\N	J.E.	Engineering	regular	2005-11-10	2026-01-09	\N	\N	\N	\N	\N	36500.00	\N	1566000409144505	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.237869	other	M	1966-01-10	\N	6	\N	\N	170900	\N	\N	6595746	110262434893	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
90	2035620	SUNIL II	\N	JR CLERK	Administration	regular	2025-03-21	2062-02-16	\N	\N	\N	\N	\N	19900.00	\N	1870000100590261	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.241715	other	M	2002-02-17	\N	2	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
91	2035621	SANTOSH	\N	Peon	Nazarat	regular	2023-03-22	2056-12-26	7351218414	\N	\N	\N	\N	18000.00	\N	1870000100592038	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.248782	other	M	1996-12-27	\N	1	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
101	1284966	JAVITRI DEVI	\N	Mali	Horticulture	regular	2004-06-03	2025-04-11	\N	\N	\N	\N	\N	35300.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.276958	other	F	1965-04-12	\N	4	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	data:image/png;base64,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	data:image/png;base64,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	f	f	f	f	f
21	1284800	PRATAP SINGH	\N	Mali	Horticulture	regular	2010-12-24	2030-08-19	9927055461	\N	\N	\N	\N	29300.00	\N	1870000400505103	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.012787	other	M	1970-08-20	\N	2	\N	\N	187000	1870007700001319	1870007700001328	6595746	111105125449	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
24	1284819	NEHA SATI	\N	Clerk	Administration	regular	2018-11-19	2059-01-13	9568006423	\N	\N	\N	\N	24500.00	\N	1870000100574306	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.021961	other	M	1999-01-14	\N	2	\N	\N	187000	1870007700002929	1870007700002938	6595746	110135140028	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
25	1284825	OM PRAKASH	\N	SUPERVISOR	Administration	regular	2010-12-24	2029-08-09	9897962437	\N	\N	\N	\N	29300.00	\N	1870000400505121	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.024466	other	M	1969-08-10	\N	2	\N	\N	187000	1870007700001188	1870007700001197	6595746	110105108206	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
26	1284852	RAJEEV SHARMA	\N	FERO BOY	Administration	regular	1996-02-26	2028-08-01	9105548835	\N	\N	EEWPS2073P	\N	40400.00	\N	1870000400498797	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.027545	other	M	1968-08-02	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
27	1284856	KISHAN LAL	\N	W/MAN	Administration	regular	2010-12-24	2028-10-09	9675690180	\N	\N	\N	\N	29300.00	\N	1870000400505219	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.029979	other	M	1968-10-10	\N	2	\N	\N	187000	1870007700000763	1870007700000781	6595746	110175125400	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
28	1284858	KAUSHAL BABU RASTOGI	\N	SUPERVISOR	Administration	regular	2010-12-24	2030-06-23	9837286682	\N	\N	\N	\N	29300.00	\N	1870000400505024	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.033073	other	M	1970-06-24	\N	2	\N	\N	187000	1870007700000709	1870007700000718	6595746	110145125469	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
29	1284864	REKHA DEVI	\N	Sweeper	Nazarat	regular	1991-09-25	2030-09-23	901270998	\N	\N	BKWPD9336F	\N	42800.00	\N	1870000400497196	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.035624	other	M	1970-09-24	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
31	1284883	SURAJ PAL	\N	Peon	Nazarat	regular	2003-07-30	2033-07-27	9568006706	\N	\N	\N	\N	36400.00	\N	1870000400506519	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.045614	other	M	1973-07-28	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
32	1284891	MOHAMMED HANEEF	\N	Mali	Horticulture	regular	1989-01-27	2028-07-31	9456871841	\N	\N	AFSPH8175A	\N	42800.00	\N	1870000400496586	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.049705	other	M	1968-08-01	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
33	1284896	SUNIL MISHRA	\N	W/MAN	Administration	regular	2010-12-24	2025-07-14	8273306640	\N	\N	\N	\N	29300.00	\N	1870000400505194	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.052462	other	M	1965-07-15	\N	2	\N	\N	187000	1870007700002026	1870007700002035	6595746	110126437528	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
34	1284901	SURENDRA KUMAR	\N	Peon	Nazarat	regular	2010-12-24	2029-01-11	9568006725	\N	\N	\N	\N	14650.00	\N	1870000400505088	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.055895	other	M	1969-01-12	\N	2	\N	\N	187000	1870007700002053	1870007700002062	6595746	110146437527	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
35	1284904	AJAY PAL	\N	SUPERVISOR	Administration	regular	2010-12-24	2028-05-19	9897837680	\N	\N	\N	\N	29300.00	\N	1870000400505352	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.058704	other	M	1968-05-20	\N	2	\N	\N	187000	110146437527	1870007700000064	6595746	111105706207	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
36	1284911	MUNISH CHAND	\N	Mali	Horticulture	regular	2010-12-24	2026-01-03	9758938207	\N	\N	\N	\N	29300.00	\N	1870000400505307	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.070909	other	M	1966-01-04	\N	2	\N	\N	187000	1870007700001054	1870007700001063	6595746	110135682746	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
37	1284916	SURAJ PAL SR	\N	Mali	Horticulture	regular	1998-11-16	2032-08-14	9927532063	\N	\N	FXTPS4434K	\N	38600.00	\N	1870000400498760	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.076118	other	M	1972-08-15	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
39	1284934	RAJU	\N	Mali	Horticulture	regular	2010-12-24	2031-04-01	7409661342	\N	\N	\N	\N	29300.00	\N	1870000400505200	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.083997	other	M	1971-04-02	\N	2	\N	\N	187000	1870007700001522	1870007700001531	6595746	110155682714	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
40	1284939	KAILASH CHAND	\N	Sweeper	Nazarat	regular	1996-06-12	2031-11-19	9668006455	\N	\N	\N	\N	41600.00	\N	1870000400498520	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.087089	other	M	1971-11-20	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
41	1284947	HAFIZ MOHD. HANEEF	\N	Mali	Horticulture	regular	2001-03-31	2029-11-01	9568006726	\N	\N	\N	\N	36400.00	\N	1870000400498344	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.091053	other	M	1969-11-02	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
42	1284953	BACCHAN VERMA	\N	W/MAN	Administration	regular	2008-02-13	2044-01-14	9568006438	\N	\N	AIAPB1828R	\N	34300.00	\N	1870000400503336	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.094663	other	M	1984-01-15	\N	4	\N	\N	187000	\N	\N	\N	110179107956	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
43	1284955	RAM DAYAL NISHAD	\N	K.BUNKAR	Administration	regular	1990-03-19	2032-07-28	7669483815	\N	\N	AONPN6941A	\N	42800.00	\N	1870000400496975	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.097046	other	M	1972-07-29	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
44	1284957	IQRAR HUSSAIN	\N	W/MAN	Administration	regular	2010-12-24	2028-11-30	9759355594	\N	\N	\N	\N	14650.00	\N	1870000400505291	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.100359	other	M	1968-12-01	\N	2	\N	\N	187000	1870007700000611	1870007700000611	6595746	110127752663	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
45	1284959	ANAND KUMAR	\N	W/MAN	Administration	regular	2010-12-24	2029-06-09	9152199133	\N	\N	\N	\N	29300.00	\N	1870000400505389	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.102949	other	M	1969-06-10	\N	2	\N	\N	187000	1870007700000082	1870007700000091	6595746	110175140057	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
47	1284967	MADAN LAL KASHYAP	\N	Gen. Operator	Administration	regular	1996-06-12	2026-07-24	9568006470	\N	\N	BGTPK8200J	\N	41600.00	\N	1870000400498159	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.107967	other	M	1966-07-25	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
48	1284968	DEVI LAL	\N	W/MAN	Administration	regular	2010-12-24	2029-05-07	9634522235	\N	\N	\N	\N	29300.00	\N	1870000400505398	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.11216	other	M	1969-05-08	\N	2	\N	\N	187000	1870007700000408	1870007700000417	6595746	110175729836	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
49	1284970	DAL CHAND	\N	Mali	Horticulture	regular	2010-12-24	2026-05-17	8057721109	\N	\N	\N	\N	29300.00	\N	1870000400505316	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.114595	other	M	1966-05-18	\N	2	\N	\N	187000	1870007700000329	1870007700000338	6595746	110125706195	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
50	1284973	RAJARAM PAL	\N	W/MAN	Administration	regular	2010-12-24	2026-10-26	7500928221	\N	\N	\N	\N	29300.00	\N	1870000400505264	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.117219	other	M	1966-10-27	\N	2	\N	\N	187000	1870007700001443	1870007700001452	6595746	110175532116	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
51	1284980	ONKAR SINGH	\N	W/MAN	Administration	regular	2010-12-24	2031-04-04	8449085155	\N	\N	\N	\N	29300.00	\N	1870000400505158	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.119713	other	M	1971-04-05	\N	2	\N	\N	187000	1870007700001221	1870007700001230	6595746	110116421936	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
52	1284981	SIYARAM	\N	Driver	Nazarat	regular	2007-10-01	2035-06-30	9568006463	\N	\N	BLLPR6622N	\N	39200.00	\N	1870000400502887	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.123907	other	M	1975-07-01	\N	5	\N	\N	187000	1870007700001957	1870007700001966	6595746	110185140034	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
53	1285100	MAHENDRA PAL SINGH	\N	Clerk	Administration	regular	2007-10-03	2044-01-29	9568006708	\N	\N	WQKPS1537N	\N	39200.00	\N	1870000400502717	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.126126	other	M	1984-01-30	\N	5	\N	\N	187000	1870007700000897	1870007700000888	6595746	110155108162	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
54	1285247	NEELAM SMT	\N	Peon	Nazarat	regular	2019-08-01	2048-12-31	7302597188	\N	\N	\N	\N	21500.00	\N	1870000400507651	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.129342	other	M	1989-01-01	\N	1	\N	\N	187000	1870007700002956	1870007700002947	6595746	110125940868	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
3	754399	SHIV DHANI SINGH YADAV	\N	C.F.A.O.	Account	regular	2000-05-04	2032-05-20	9415443017	ShivDhani@gmail.com	PrayagRaj Uttar Pradesh	BYIPB8789L	\N	122900.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-12 13:08:45.714	officer	M	1972-05-21	\N	12	\N	\N	\N	\N	\N	\N	\N	Married	121212121212	POST GRADUATION	B	Officer	GPF	\N	\N	f	\N	\N	f	f	f	f	f
2	2	VANDITA SRIVASTAVA	\N	Secretary	Establishment	regular	1995-07-17	2037-07-14	\N	\N	\N	\N	\N	80900.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 16:04:07.297	officer	F	1977-07-15	\N	12	\N	\N	\N	\N	\N	\N	\N	Married	\N	\N	\N	Officer	GPF	\N	\N	f	\N	\N	f	f	f	f	f
1	2000878	MANIKANDAN A.	\N	VC	Establishment	regular	2008-01-05	2056-11-03	\N	\N	\N	\N	\N	83300.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 16:16:34.528	officer	M	1996-11-04	\N	11	\N	\N	\N	\N	\N	\N	\N	Married	\N	\N	\N	Officer	GPF	\N	\N	f	\N	\N	f	f	f	t	f
4	4	Sri DEEPAK KUMAR	\N	Joint Secretary	Establishment	regular	2000-03-20	2026-04-02	\N	\N	\N	\N	\N	96600.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 16:36:58.267	officer	M	1966-04-03	\N	11	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Officer	GPF	\N	\N	f	\N	\N	f	f	f	f	f
5	5	Sri GAUTAM SINGH	\N	OSD	Establishment	regular	2000-12-20	2026-11-19	\N	\N	\N	\N	\N	73200.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.951229	other	M	1966-11-20	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
6	1283767	DEVENDRA SINGH BISHT	\N	Clerk	Administration	regular	1996-12-30	2029-06-24	9568006446	\N	\N	ARSPB5049D	\N	50500.00	\N	1870000400498061	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.954777	other	M	1969-06-25	\N	6	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
7	1284555	HARISH KUMAR GANGWAR	\N	SUPERVISOR	Administration	regular	2010-12-24	2029-12-13	6396216479	\N	\N	\N	\N	29300.00	\N	1870000400505060	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.957675	other	M	1969-12-14	\N	2	\N	\N	187000	1870007700000550	1870007700000569	6595746	110187752657	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
8	1284574	RAMESH CHANDRA VERMA	\N	J.E.	Engineering	regular	2004-10-14	2027-08-31	9568006426	\N	\N	AEJPV5344P	\N	73200.00	\N	1870006900001828	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.962149	other	M	1967-09-01	\N	10	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
9	1284633	RAMAN KUMAR	\N	A.E.	Engineering	regular	2004-10-14	2028-06-30	9568006410	\N	\N	ADBPA5147Q	\N	73200.00	\N	4718000100026928	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.965455	other	M	1968-07-01	\N	9	\N	t	471800	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
10	1284677	SUNEEL	\N	JR CLERK	Administration	regular	2022-10-31	2058-08-11	9568006716	\N	\N	\N	\N	23100.00	\N	1870000100577109	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.968996	other	M	1998-08-12	\N	2	\N	\N	187000	1870007700002974	1870007700002965	6595746	110157752653	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
11	1284682	VIKRANT SINGH	\N	JR CLERK	Administration	regular	2020-02-26	2052-10-23	9568006715	\N	\N	\N	\N	22400.00	\N	1870001500005098	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.972393	other	M	1992-10-24	\N	2	\N	\N	187000	1870007700002910	1870007700002901	6595746	110125108186	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
12	1284691	MITTHAN LAL	\N	W/MAN	Administration	regular	1989-01-27	2026-01-23	9568006398	\N	\N	LVEPS4239M	\N	38600.00	\N	1870000400498584	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.975914	other	M	1966-01-24	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
13	1284722	RAJESH KUMAR	\N	DAFTARI	Administration	regular	2001-03-31	2026-06-30	8923055720	\N	\N	\N	\N	37500.00	\N	1870000400499219	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.979162	other	M	1966-07-01	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
14	1284728	PARWATI DEVI	\N	Peon	Nazarat	regular	1994-01-21	2028-12-31	7351972610	\N	\N	BVPPD3040N	\N	42800.00	\N	1870000400496647	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.981899	other	M	1969-01-01	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
15	1284745	MAHESH PAL	\N	Mali	Horticulture	regular	2010-12-24	2026-03-06	9568403539	\N	\N	\N	\N	29300.00	\N	1870000400505237	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.987236	other	M	1966-02-07	\N	2	\N	\N	187000	1870007700000903	1870007700000912	6595746	110145691115	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
16	1284746	ASHOK KUMAR JOSHI	\N	D/MAN	Administration	regular	1995-10-01	2026-03-06	9568006710	\N	\N	AOJPJ6696J	\N	50500.00	\N	1870000400498317	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.990684	other	M	1966-03-07	\N	6	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
17	1284757	BHAGWAN DASS	\N	Electrician	Administration	regular	1989-08-09	2028-04-19	9568006460	\N	\N	AQAPD4902E	\N	44100.00	\N	1870000400498283	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.994307	other	M	1968-04-20	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
18	1284776	UMESH KUMAR	\N	Clerk	Administration	regular	2015-06-27	2047-07-01	9568006456	\N	\N	AXXPK0511A	\N	26800.00	\N	1870000100558566	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:56.997386	other	M	1987-07-02	\N	2	\N	\N	187000	1870007700002576	1870007700002585	6595746	111105125385	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
20	1284797	MADAN LAL	\N	Mali	Horticulture	regular	1996-05-25	2025-07-14	7500143553	\N	\N	\N	\N	41600.00	\N	1870000400497017	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.010044	other	M	1965-07-15	\N	5	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
23	1284809	BABU LAL	\N	Sweeper	Nazarat	regular	1995-10-01	2027-03-05	9528310126	\N	\N	AIYPL0957B	\N	41600.00	\N	1870000400497284	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.017748	other	M	1967-02-06	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
64	1335856	RASHID KHAN	\N	BLUE PRI	Administration	regular	2001-03-31	2029-11-30	9897361650	\N	\N	\N	\N	37500.00	\N	1870000400497859	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.158566	other	M	1969-12-01	\N	4	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
102	1284861	DORI LAL	\N	Mali	Horticulture	regular	2010-12-24	2025-06-19	\N	\N	\N	\N	\N	28400.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.281285	other	M	1965-06-20	\N	2	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
103	EMP-103	YOGENDRA KUMAR	\N	Secretary	Establishment	regular	2025-07-29	2085-08-03	\N	\N	\N	BFOPK6682J	\N	94100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.285695	other	M	1975-08-04	\N	12	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
105	105	AJEET KUMAR SINGH	\N	OSD	Establishment	regular	1999-10-30	2035-06-15	\N	\N	\N	\N	\N	71100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 17:11:34.33	officer	M	1975-06-16	\N	10	\N	\N	\N	\N	\N	\N	\N	Married	\N	\N	\N	Officer	GPF	\N	\N	f	\N	\N	f	f	f	f	f
104	1294060	MANOJ KUMAR SINGH	\N	A.E.	Engineering	regular	1999-10-30	2036-04-03	\N	\N	\N	AQOPS2838N	\N	80000.00	\N	00320110000144	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.298228	other	M	1976-04-04	\N	10	\N	t	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
107	EMP-107	SMT NEELAM SRIVASTAVA	\N	OSD	Establishment	regular	2003-08-15	2035-03-28	1231231231	\N	\N	\N	\N	\N	\N	30485609288	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 09:14:37.548195	officer	M	1975-03-29	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Officer	GPF	\N	\N	f	\N	\N	f	f	f	f	f
56	1291365	SATYA PRAKASH KUSHWAHA	\N	J.E.	Engineering	regular	2004-10-14	2028-07-09	8272080606	\N	\N	ARHPK3579L	\N	66000.00	\N	6563000100046830	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.134691	other	M	1968-07-10	\N	6	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
59	1296125	RAMBHAROSE LAL	\N	Mali	Horticulture	regular	2010-12-24	2030-03-24	9568006465	\N	\N	\N	\N	29300.00	\N	1870000400505167	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.1419	other	M	1970-02-25	\N	2	\N	\N	187000	1870007700001674	1870007700001683	6595746	110135532118	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
60	1303440	YOGENDRA KUMAR EE	\N	Ex. Engg.	Engineering	regular	1999-10-26	2034-08-31	\N	\N	\N	APWPK4862R	\N	91100.00	\N	1870000100587601	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.146363	other	M	1974-09-01	\N	11	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
61	1328324	DHARMVIR SINGH	\N	A.E.	Engineering	regular	2008-02-05	2054-07-10	9557446778	\N	\N	AWKPS1320F	\N	73400.00	\N	0674000100237561	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.14885	other	M	1994-07-11	\N	10	\N	t	462600	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
62	1328431	FAIYAZ AHMAD KHAN	\N	C.PROGRAMMER	Computer Section	regular	1997-02-06	2028-06-27	9568006444	\N	\N	AHAPK3255C	\N	142700.00	\N	1870000400500001	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.152035	other	M	1968-06-28	\N	13	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
63	1328951	ANIL KUMAR	\N	Ex. Engg.	Engineering	regular	1999-10-22	2032-04-10	9760097102	\N	\N	AQOPK1330P	\N	83300.00	\N	1870006900003996	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.154944	other	M	1972-04-11	\N	11	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
65	1339601	SANJAY MEHROTRA	\N	Accountant	Account	regular	2018-11-01	2029-09-09	9927800775	\N	\N	AJEPM7007J	\N	57897.00	\N	1870000100574263	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.161287	other	M	1969-09-10	\N	7	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
67	1349589	GURJEET SINGH	\N	Peon	Nazarat	regular	2008-02-15	2048-01-09	9568006474	\N	\N	\N	\N	34300.00	\N	1870000400503327	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.166501	other	M	1988-01-10	\N	4	\N	\N	187000	\N	\N	\N	111107752639	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
68	1349836	BABBU MIAN	\N	Peon	Nazarat	regular	1984-05-11	2026-10-06	7895256401	\N	\N	BXGPM1407F	\N	45400.00	\N	1870000400497169	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.169603	other	M	1966-10-07	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
69	1350223	BIJENDRA BABU	\N	Sweeper	Nazarat	regular	1995-09-01	2033-12-11	9897630853	\N	\N	AGWPV6412B	\N	41600.00	\N	1870000400499583	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.172269	other	M	1973-12-12	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
70	1350411	PARAS SHARMA	\N	Clerk	Administration	regular	2004-10-15	2043-10-24	9568006452	\N	\N	ELGPS7429E	\N	41600.00	\N	1870000400497673	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.174774	other	M	1983-10-25	\N	5	\N	f	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
71	1350415	SANJEEV KUMAR SHARMA	\N	Clerk	Administration	regular	1997-07-31	2032-07-28	9568006458	\N	\N	DVXPS7649N	\N	52000.00	\N	1870000400500232	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.182217	other	M	1972-07-29	\N	6	\N	f	187000	1870007700001735	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
73	1350443	VIRENDRA KUMAR	\N	Peon	Nazarat	regular	2014-06-03	2052-09-18	9760080301	\N	\N	\N	\N	25600.00	\N	1870000400506670	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.188905	other	M	1992-09-19	\N	1	\N	\N	187000	1870007700002628	1870007700002646	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
74	1350663	RAKESH KUMAR	\N	Mali	Horticulture	regular	2010-12-24	2030-07-09	9193616276	\N	\N	\N	\N	29300.00	\N	1870000400505404	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.191897	other	M	1970-07-10	\N	2	\N	\N	187000	1870007700001540	1870007700001559	6595746	111105682717	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
75	1351198	AJAY KUMAR SINGH	\N	C.T.P.	Planning	regular	2005-03-15	2033-08-15	\N	\N	\N	ATQPS2448K	\N	130600.00	\N	1870000100590368	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.194823	other	M	1973-08-16	\N	1	\N	t	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
76	1376250	MOHIT KUMAR II	\N	JR CLERK	Administration	regular	2021-06-16	2056-09-30	9568006436	\N	\N	\N	\N	22400.00	\N	1870000100578746	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.198742	other	M	1996-10-01	\N	2	\N	\N	187000	\N	\N	6595746	110105140038	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
77	1376264	PANKAJ KUMAR	\N	JR CLERK	Administration	regular	2021-06-15	2054-07-10	9568006471	\N	\N	\N	\N	22400.00	\N	1870000100578755	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.201563	other	M	1994-07-11	\N	2	\N	\N	187000	\N	\N	6595746	110125125408	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
78	1376269	ROHIT KASHYAP	\N	Peon	Nazarat	regular	2005-03-16	2026-03-09	\N	\N	\N	\N	\N	19700.00	\N	1870000100578302	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.204103	other	M	1966-03-10	\N	1	\N	\N	187000	\N	\N	6595746	111105140047	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
79	1407773	SANDEEP KUMAR	\N	A.E.	Engineering	regular	2022-04-22	2055-02-15	\N	\N	\N	EGIPK9282C	\N	63100.00	\N	3686000101253977	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.206767	other	M	1995-02-16	\N	10	\N	\N	368600	\N	\N	6595746	110169036461	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
80	1409769	RAJAT SINGH	\N	A.E.	Engineering	regular	2021-11-03	2056-07-09	\N	\N	\N	HRMPS3773L	\N	63100.00	\N	1870000400508632	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.209944	other	M	1996-07-10	\N	10	\N	\N	187000	\N	\N	6595746	6595746	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
82	1683585	DHARM VEER	\N	JR CLERK	Administration	regular	2022-12-19	2055-10-14	6272080602	\N	\N	\N	\N	21700.00	\N	1870000100583377	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.215945	other	M	1995-10-15	\N	2	\N	\N	187000	\N	\N	6595746	111107651312	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
83	1683775	LALIT BHATT	\N	JR CLERK	Administration	regular	2023-03-25	2058-07-09	8272080602	\N	\N	\N	\N	21100.00	\N	1870000400508748	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.218923	other	M	1998-07-10	\N	2	\N	\N	187000	\N	\N	6595746	110157752636	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
92	2035622	GIRISH	\N	Mali	Horticulture	regular	2025-03-21	2058-06-03	\N	\N	\N	\N	\N	18000.00	\N	1870000100592065	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.251194	other	M	1998-06-04	\N	1	\N	\N	187000	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
106	1296156	GAJENDRA PAL SHARMA	\N	A.E.	Engineering	regular	1998-03-10	2045-04-09	\N	\N	\N	\N	\N	41064.00	\N	86282180001550	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.305269	other	M	1985-04-10	\N	10	\N	t	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
108	EMP-108	SURENDRA DWIVEDI	\N	J.E.	Engineering	regular	1995-01-20	2031-03-24	\N	\N	\N	\N	\N	66000.00	\N	2512000100145944	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.312424	other	M	1971-03-25	\N	6	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
109	EMP-109	RAJENDRA SINGH	\N	Accountant	Account	regular	1990-09-01	2025-08-31	\N	\N	\N	\N	\N	51694.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.314496	other	M	1965-09-01	\N	7	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
93	2036297	VASUDHA SHARMA	\N	A.T.P	Planning	regular	2025-04-24	2056-01-30	\N	\N	\N	\N	\N	56100.00	\N	6267000400003273	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.25363	other	M	1996-01-31	\N	10	\N	\N	187000	\N	\N	6595746	110118006233	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
94	1284592	AMAR SHAHI	\N	A.E.	Engineering	regular	2004-10-15	2026-04-25	\N	\N	\N	AXRPS3687D	\N	71100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.257131	other	M	1966-04-26	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
95	1284598	ARVIND KUMAR SRIVASTAVA	\N	A.E.	Engineering	regular	1991-10-21	2028-07-09	\N	\N	\N	BAOPS7505P	\N	71100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.259575	other	M	1968-07-10	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
96	1284572	KRISHNA KANT SHARMA	\N	A.E.	Engineering	regular	2004-10-14	2025-06-30	\N	\N	\N	BDWPS8910D	\N	71100.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.26222	other	M	1965-07-01	\N	10	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
98	1284645	SANJEEV KUMAR	\N	U.S	Administration	regular	2007-12-04	2046-05-20	\N	\N	\N	BLUPK7745N	\N	53600.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.269017	other	M	1986-05-21	\N	6	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
99	1284731	ATUL KUMAR SHARMA	\N	Clerk	Administration	regular	1996-12-26	2026-06-29	\N	\N	\N	BTGPS8274J	\N	49000.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.271491	other	M	1966-06-30	\N	6	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
100	1350707	RAM AVTAR	\N	Mali	Horticulture	regular	1989-01-27	2025-05-25	\N	\N	\N	AYWRA2620E	\N	41600.00	\N	\N	\N	\N	active	t	2026-07-11 09:14:37.548195	2026-07-11 15:08:57.274117	other	M	1965-05-26	\N	5	\N	\N	\N	\N	\N	\N	\N	Unmarried	\N	\N	\N	Oth. Staff	GPF	\N	\N	f	\N	\N	f	f	f	f	f
\.


--
-- Data for Name: finance_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance_transactions (id, voucher_no, transaction_date, type, budget_head_id, head_code, amount, description, party_name, cheque_no, bank_name, status, approved_by, remarks, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: grievance_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grievance_roles (id, name, is_active, created_at) FROM stdin;
1	Comp. Programmer	t	2026-07-03 23:36:21.807331
2	Operator	t	2026-07-04 08:19:46.410471
3	User	t	2026-07-04 08:25:33.810897
\.


--
-- Data for Name: grievance_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grievance_sections (id, name, is_active, created_at) FROM stdin;
1	Property	t	2026-07-03 23:34:54.334187
2	Computer	t	2026-07-03 23:35:09.573639
3	Enforcement	t	2026-07-04 08:18:26.076324
4	Engineering	t	2026-07-04 08:18:35.476229
5	Planning	t	2026-07-04 08:18:45.464877
6	Secretary Office	t	2026-07-04 08:19:13.915815
\.


--
-- Data for Name: grievance_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grievance_subjects (id, subject, section_id, role_id, officer_name, officer_mobile, officer_email, is_active, created_at) FROM stdin;
2	NOC Related Query	5	2	\N	9568006403	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
3	Map Related Query	5	2	\N	9568006403	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
4	Unauthorized Construction Related Query	3	2	\N	8272080605	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
5	Property Registry Related Query	1	2	\N	9568006333	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
6	Property Possession Related Query	1	2	\N	9568006333	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
7	Engineering Related Query	4	2	\N	9568006403	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
8	JE(ADVISOR)	4	2	\N	9568006403	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
9	Secretary Office	6	2	\N	8272080602	grievance.bda.cc@gmail.com	t	2026-07-04 08:25:33.850929
1	Other Query	1	2	Faiyaz Ahamad Khan	9568006333	grievance.bda.cc@gmail.com	t	2026-07-03 23:40:07.063838
\.


--
-- Data for Name: grievances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grievances (id, ticket_no, applicant_name, mobile, email, address, category, subject, description, attachment_url, status, assigned_to, assigned_department, resolution, resolved_date, remarks, is_active, created_at, updated_at) FROM stdin;
2	GRV-MR5L25VO	Manish Kumar	9839007934	sbm7934@gmail.com	\N	other	Property Related Query	Test	\N	submitted	\N	\N	\N	\N	\N	t	2026-07-03 23:47:16.942406	2026-07-03 23:47:16.942406
1	GRV-MR5L0RH1	Test User	9876543210	test@test.com	\N	other	Road issue	Test complaint	\N	closed			Issue Resolved By EE	\N		t	2026-07-03 23:46:11.625436	2026-07-04 00:03:51.648
3	GRV-MR5L9IED	Ravi Sekhawat	1234567890	abc@jhh.kjh	\N	other	Property Related Query	njhgghkjvh jhxfghkgv kjhcfug	\N	rejected			Fake Issue Raised.	\N		t	2026-07-03 23:52:59.762079	2026-07-04 00:04:21.168
5	BDA-MR5LGQR9	Sadhana Singh	9897979768	bjhch@hgjh.khjghf	\N	other	Property Related Query	utyrjjv khufycc bjyydugsh	\N	resolved				\N		t	2026-07-03 23:58:37.185524	2026-07-04 00:04:33.911
4	BDA-MR5LAU83	Test	9876543210	\N	\N	other	Road	Test	\N	acknowledged				\N		t	2026-07-03 23:54:01.735707	2026-07-04 00:04:45.714
6	BDA-MR631K6B	Mohan Shukla 	9839007934	jjds@lk.kjh	\N	other	Property Related Query	tfyfeqwb jhctysijab uyfddsavuyfs	\N	submitted	\N	\N	\N	\N	\N	t	2026-07-04 08:10:41.900093	2026-07-04 08:10:41.900093
7	BDA-MR9L90UH	Anju Singh	9898989898	kjj@kkj.cjcj	\N	other	Engineering Related Query	tesgsj jbvcgd jvcdw	\N	acknowledged				\N		t	2026-07-06 19:03:41.717748	2026-07-06 19:05:27.338
\.


--
-- Data for Name: leave_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_heads (id, name, default_days, is_active, created_at) FROM stdin;
1	CL	10.00	t	2026-07-11 10:43:10.771574
2	EL	15.00	t	2026-07-11 10:43:31.735728
\.


--
-- Data for Name: lic_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lic_entries (id, employee_id, emp_code, emp_name, policy_no, premium_amount, entry_date, remarks, is_active, created_at, updated_at) FROM stdin;
1	35	1284904	AJAY PAL	223405425	840.00	2026-07-11	\N	t	2026-07-11 13:47:13.67091	2026-07-11 13:47:13.67091
2	35	1284904	AJAY PAL	223406091	575.00	2026-07-11	\N	t	2026-07-11 13:47:13.702833	2026-07-11 13:47:13.702833
3	35	1284904	AJAY PAL	223406123	575.00	2026-07-11	\N	t	2026-07-11 13:47:13.705933	2026-07-11 13:47:13.705933
4	35	1284904	AJAY PAL	223409277	323.00	2026-07-11	\N	t	2026-07-11 13:47:13.709435	2026-07-11 13:47:13.709435
5	35	1284904	AJAY PAL	223409279	323.00	2026-07-11	\N	t	2026-07-11 13:47:13.712579	2026-07-11 13:47:13.712579
6	35	1284904	AJAY PAL	227142375	655.00	2026-07-11	\N	t	2026-07-11 13:47:13.715505	2026-07-11 13:47:13.715505
7	45	1284959	ANAND KUMAR	223405180	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.717924	2026-07-11 13:47:13.717924
8	45	1284959	ANAND KUMAR	223405441	559.00	2026-07-11	\N	t	2026-07-11 13:47:13.721211	2026-07-11 13:47:13.721211
9	45	1284959	ANAND KUMAR	223405765	1022.00	2026-07-11	\N	t	2026-07-11 13:47:13.723734	2026-07-11 13:47:13.723734
10	45	1284959	ANAND KUMAR	223407345	572.00	2026-07-11	\N	t	2026-07-11 13:47:13.726493	2026-07-11 13:47:13.726493
11	45	1284959	ANAND KUMAR	223409317	703.00	2026-07-11	\N	t	2026-07-11 13:47:13.728416	2026-07-11 13:47:13.728416
12	45	1284959	ANAND KUMAR	227398417	1424.00	2026-07-11	\N	t	2026-07-11 13:47:13.731424	2026-07-11 13:47:13.731424
13	45	1284959	ANAND KUMAR	227398418	1424.00	2026-07-11	\N	t	2026-07-11 13:47:13.734108	2026-07-11 13:47:13.734108
14	16	1284746	ASHOK KUMAR JOSHI	221508659	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.736671	2026-07-11 13:47:13.736671
15	68	1349836	BABBU MIAN	223405181	604.00	2026-07-11	\N	t	2026-07-11 13:47:13.73928	2026-07-11 13:47:13.73928
16	23	1284809	BABU LAL	223407066	794.00	2026-07-11	\N	t	2026-07-11 13:47:13.741854	2026-07-11 13:47:13.741854
17	23	1284809	BABU LAL	227141976	1229.00	2026-07-11	\N	t	2026-07-11 13:47:13.745571	2026-07-11 13:47:13.745571
18	23	1284809	BABU LAL	227144392	1700.00	2026-07-11	\N	t	2026-07-11 13:47:13.747876	2026-07-11 13:47:13.747876
19	42	1284953	BACCHAN VERMA	227390244	950.00	2026-07-11	\N	t	2026-07-11 13:47:13.749748	2026-07-11 13:47:13.749748
20	69	1350223	BIJENDRA BABU	222576892	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.752474	2026-07-11 13:47:13.752474
21	69	1350223	BIJENDRA BABU	222577679	2269.00	2026-07-11	\N	t	2026-07-11 13:47:13.754508	2026-07-11 13:47:13.754508
22	49	1284970	DAL CHAND	223404973	604.00	2026-07-11	\N	t	2026-07-11 13:47:13.756597	2026-07-11 13:47:13.756597
23	6	1283767	DEVENDRA SINGH BISHT	222579004	555.00	2026-07-11	\N	t	2026-07-11 13:47:13.758871	2026-07-11 13:47:13.758871
24	66	1349504	DILEEP KUMAR	222577792	2042.00	2026-07-11	\N	t	2026-07-11 13:47:13.761552	2026-07-11 13:47:13.761552
25	66	1349504	DILEEP KUMAR	222579006	406.00	2026-07-11	\N	t	2026-07-11 13:47:13.763689	2026-07-11 13:47:13.763689
26	67	1349589	GURJEET SINGH	222579005	412.00	2026-07-11	\N	t	2026-07-11 13:47:13.765861	2026-07-11 13:47:13.765861
27	41	1284947	HAFIZ MOHD. HANEEF	222577772	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.76782	2026-07-11 13:47:13.76782
28	44	1284957	IQRAR HUSSAIN	223404905	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.770226	2026-07-11 13:47:13.770226
29	44	1284957	IQRAR HUSSAIN	223404904	559.00	2026-07-11	\N	t	2026-07-11 13:47:13.772825	2026-07-11 13:47:13.772825
30	44	1284957	IQRAR HUSSAIN	227141992	1009.00	2026-07-11	\N	t	2026-07-11 13:47:13.775814	2026-07-11 13:47:13.775814
31	40	1284939	KAILASH CHAND	223407443	294.00	2026-07-11	\N	t	2026-07-11 13:47:13.825591	2026-07-11 13:47:13.825591
32	40	1284939	KAILASH CHAND	227141760	741.00	2026-07-11	\N	t	2026-07-11 13:47:13.828327	2026-07-11 13:47:13.828327
33	40	1284939	KAILASH CHAND	227141761	408.00	2026-07-11	\N	t	2026-07-11 13:47:13.830487	2026-07-11 13:47:13.830487
34	40	1284939	KAILASH CHAND	227145107	287.00	2026-07-11	\N	t	2026-07-11 13:47:13.833217	2026-07-11 13:47:13.833217
35	40	1284939	KAILASH CHAND	227145108	287.00	2026-07-11	\N	t	2026-07-11 13:47:13.83619	2026-07-11 13:47:13.83619
36	27	1284856	KISHAN LAL	223404982	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.839265	2026-07-11 13:47:13.839265
37	27	1284856	KISHAN LAL	227144221	1678.00	2026-07-11	\N	t	2026-07-11 13:47:13.841665	2026-07-11 13:47:13.841665
38	58	1296121	LALTA PRASAD	223404943	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.843508	2026-07-11 13:47:13.843508
39	58	1296121	LALTA PRASAD	223404898	572.00	2026-07-11	\N	t	2026-07-11 13:47:13.845457	2026-07-11 13:47:13.845457
40	58	1296121	LALTA PRASAD	227141349	1995.00	2026-07-11	\N	t	2026-07-11 13:47:13.847846	2026-07-11 13:47:13.847846
41	20	1284797	MADAN LAL	223402834	587.00	2026-07-11	\N	t	2026-07-11 13:47:13.850998	2026-07-11 13:47:13.850998
42	20	1284797	MADAN LAL	223407161	644.00	2026-07-11	\N	t	2026-07-11 13:47:13.853217	2026-07-11 13:47:13.853217
43	20	1284797	MADAN LAL	223404977	510.00	2026-07-11	\N	t	2026-07-11 13:47:13.855765	2026-07-11 13:47:13.855765
44	20	1284797	MADAN LAL	227141330	1602.00	2026-07-11	\N	t	2026-07-11 13:47:13.858485	2026-07-11 13:47:13.858485
45	20	1284797	MADAN LAL	227143934	1278.00	2026-07-11	\N	t	2026-07-11 13:47:13.860587	2026-07-11 13:47:13.860587
46	12	1284691	MITTHAN LAL	222940151	453.00	2026-07-11	\N	t	2026-07-11 13:47:13.862788	2026-07-11 13:47:13.862788
47	12	1284691	MITTHAN LAL	223404976	612.00	2026-07-11	\N	t	2026-07-11 13:47:13.864892	2026-07-11 13:47:13.864892
48	12	1284691	MITTHAN LAL	223407067	745.00	2026-07-11	\N	t	2026-07-11 13:47:13.867427	2026-07-11 13:47:13.867427
49	32	1284891	MOHAMMED HANEEF	227144793	754.00	2026-07-11	\N	t	2026-07-11 13:47:13.869859	2026-07-11 13:47:13.869859
50	32	1284891	MOHAMMED HANEEF	227145405	1046.00	2026-07-11	\N	t	2026-07-11 13:47:13.872413	2026-07-11 13:47:13.872413
51	32	1284891	MOHAMMED HANEEF	227141316	1995.00	2026-07-11	\N	t	2026-07-11 13:47:13.875155	2026-07-11 13:47:13.875155
52	32	1284891	MOHAMMED HANEEF	223402833	546.00	2026-07-11	\N	t	2026-07-11 13:47:13.87767	2026-07-11 13:47:13.87767
53	55	1285615	MOHIT KUMAR	227143730	1920.00	2026-07-11	\N	t	2026-07-11 13:47:13.879818	2026-07-11 13:47:13.879818
54	55	1285615	MOHIT KUMAR	227143731	1558.00	2026-07-11	\N	t	2026-07-11 13:47:13.881963	2026-07-11 13:47:13.881963
55	55	1285615	MOHIT KUMAR	227144764	1949.00	2026-07-11	\N	t	2026-07-11 13:47:13.884036	2026-07-11 13:47:13.884036
56	76	1376250	MOHIT KUMAR II	227145496	2240.00	2026-07-11	\N	t	2026-07-11 13:47:13.886541	2026-07-11 13:47:13.886541
57	76	1376250	MOHIT KUMAR II	227398416	880.00	2026-07-11	\N	t	2026-07-11 13:47:13.888798	2026-07-11 13:47:13.888798
58	36	1284911	MUNISH CHAND	223404941	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.890928	2026-07-11 13:47:13.890928
59	38	1284933	NIRMALA	242764118	1120.00	2026-07-11	\N	t	2026-07-11 13:47:13.892958	2026-07-11 13:47:13.892958
60	38	1284933	NIRMALA	242764119	1120.00	2026-07-11	\N	t	2026-07-11 13:47:13.895554	2026-07-11 13:47:13.895554
61	25	1284825	OM PRAKASH	223404906	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.897639	2026-07-11 13:47:13.897639
62	25	1284825	OM PRAKASH	223404903	428.00	2026-07-11	\N	t	2026-07-11 13:47:13.899655	2026-07-11 13:47:13.899655
63	51	1284980	ONKAR SINGH	223404970	964.00	2026-07-11	\N	t	2026-07-11 13:47:13.902118	2026-07-11 13:47:13.902118
64	51	1284980	ONKAR SINGH	223407407	294.00	2026-07-11	\N	t	2026-07-11 13:47:13.90467	2026-07-11 13:47:13.90467
65	51	1284980	ONKAR SINGH	227145034	834.00	2026-07-11	\N	t	2026-07-11 13:47:13.910695	2026-07-11 13:47:13.910695
66	51	1284980	ONKAR SINGH	227141993	748.00	2026-07-11	\N	t	2026-07-11 13:47:13.91265	2026-07-11 13:47:13.91265
67	70	1350411	PARAS SHARMA	222579001	1616.00	2026-07-11	\N	t	2026-07-11 13:47:13.915054	2026-07-11 13:47:13.915054
68	14	1284728	PARWATI DEVI	221509782	2213.00	2026-07-11	\N	t	2026-07-11 13:47:13.918086	2026-07-11 13:47:13.918086
69	14	1284728	PARWATI DEVI	221509836	806.00	2026-07-11	\N	t	2026-07-11 13:47:13.920077	2026-07-11 13:47:13.920077
70	14	1284728	PARWATI DEVI	221509993	775.00	2026-07-11	\N	t	2026-07-11 13:47:13.921992	2026-07-11 13:47:13.921992
71	21	1284800	PRATAP SINGH	223404968	964.00	2026-07-11	\N	t	2026-07-11 13:47:13.923845	2026-07-11 13:47:13.923845
72	21	1284800	PRATAP SINGH	223407218	1077.00	2026-07-11	\N	t	2026-07-11 13:47:13.926389	2026-07-11 13:47:13.926389
73	21	1284800	PRATAP SINGH	227144751	2436.00	2026-07-11	\N	t	2026-07-11 13:47:13.928363	2026-07-11 13:47:13.928363
74	50	1284973	RAJARAM PAL	223404971	587.00	2026-07-11	\N	t	2026-07-11 13:47:13.930879	2026-07-11 13:47:13.930879
75	50	1284973	RAJARAM PAL	223404945	1021.00	2026-07-11	\N	t	2026-07-11 13:47:13.932965	2026-07-11 13:47:13.932965
76	50	1284973	RAJARAM PAL	227141657	814.00	2026-07-11	\N	t	2026-07-11 13:47:13.936156	2026-07-11 13:47:13.936156
77	39	1284934	RAJU	222577548	1531.00	2026-07-11	\N	t	2026-07-11 13:47:13.938487	2026-07-11 13:47:13.938487
78	74	1350663	RAKESH KUMAR	227141275	772.00	2026-07-11	\N	t	2026-07-11 13:47:13.941284	2026-07-11 13:47:13.941284
79	74	1350663	RAKESH KUMAR	227141281	751.00	2026-07-11	\N	t	2026-07-11 13:47:13.943868	2026-07-11 13:47:13.943868
80	59	1296125	RAMBHAROSE LAL	223404978	991.00	2026-07-11	\N	t	2026-07-11 13:47:13.945968	2026-07-11 13:47:13.945968
81	30	1284871	SERVESH PAL	223405178	964.00	2026-07-11	\N	t	2026-07-11 13:47:13.947906	2026-07-11 13:47:13.947906
82	30	1284871	SERVESH PAL	227144293	990.00	2026-07-11	\N	t	2026-07-11 13:47:13.950756	2026-07-11 13:47:13.950756
83	52	1284981	SIYARAM	223404981	874.00	2026-07-11	\N	t	2026-07-11 13:47:13.953271	2026-07-11 13:47:13.953271
84	52	1284981	SIYARAM	223408594	398.00	2026-07-11	\N	t	2026-07-11 13:47:13.956164	2026-07-11 13:47:13.956164
85	52	1284981	SIYARAM	223408597	398.00	2026-07-11	\N	t	2026-07-11 13:47:13.95964	2026-07-11 13:47:13.95964
86	52	1284981	SIYARAM	227141656	466.00	2026-07-11	\N	t	2026-07-11 13:47:13.962554	2026-07-11 13:47:13.962554
87	52	1284981	SIYARAM	227145065	292.00	2026-07-11	\N	t	2026-07-11 13:47:13.965053	2026-07-11 13:47:13.965053
88	52	1284981	SIYARAM	227145066	292.00	2026-07-11	\N	t	2026-07-11 13:47:13.968725	2026-07-11 13:47:13.968725
89	10	1284677	SUNEEL	227145632	1595.00	2026-07-11	\N	t	2026-07-11 13:47:13.971988	2026-07-11 13:47:13.971988
90	90	2035620	SUNIL II	1111	1075.00	2026-07-11	\N	t	2026-07-11 13:47:13.974668	2026-07-11 13:47:13.974668
91	31	1284883	SURAJ PAL	223402093	715.00	2026-07-11	\N	t	2026-07-11 13:47:13.976543	2026-07-11 13:47:13.976543
92	31	1284883	SURAJ PAL	223405444	408.00	2026-07-11	\N	t	2026-07-11 13:47:13.97866	2026-07-11 13:47:13.97866
93	31	1284883	SURAJ PAL	223407444	224.00	2026-07-11	\N	t	2026-07-11 13:47:13.980504	2026-07-11 13:47:13.980504
94	31	1284883	SURAJ PAL	227145417	765.00	2026-07-11	\N	t	2026-07-11 13:47:13.982957	2026-07-11 13:47:13.982957
95	31	1284883	SURAJ PAL	227145418	1100.00	2026-07-11	\N	t	2026-07-11 13:47:13.984804	2026-07-11 13:47:13.984804
96	34	1284901	SURENDRA KUMAR	227145266	4021.00	2026-07-11	\N	t	2026-07-11 13:47:13.986767	2026-07-11 13:47:13.986767
97	18	1284776	UMESH KUMAR	227142578	1125.00	2026-07-11	\N	t	2026-07-11 13:47:13.989136	2026-07-11 13:47:13.989136
98	18	1284776	UMESH KUMAR	227142582	325.00	2026-07-11	\N	t	2026-07-11 13:47:13.991918	2026-07-11 13:47:13.991918
99	18	1284776	UMESH KUMAR	227145100	445.00	2026-07-11	\N	t	2026-07-11 13:47:13.994977	2026-07-11 13:47:13.994977
100	18	1284776	UMESH KUMAR	227145101	445.00	2026-07-11	\N	t	2026-07-11 13:47:13.997402	2026-07-11 13:47:13.997402
101	18	1284776	UMESH KUMAR	227145102	445.00	2026-07-11	\N	t	2026-07-11 13:47:13.999683	2026-07-11 13:47:13.999683
102	18	1284776	UMESH KUMAR	227145103	445.00	2026-07-11	\N	t	2026-07-11 13:47:14.002572	2026-07-11 13:47:14.002572
103	18	1284776	UMESH KUMAR	227145104	445.00	2026-07-11	\N	t	2026-07-11 13:47:14.005391	2026-07-11 13:47:14.005391
104	73	1350443	VIRENDRA KUMAR	222579407	723.00	2026-07-11	\N	t	2026-07-11 13:47:14.0089	2026-07-11 13:47:14.0089
105	73	1350443	VIRENDRA KUMAR	227384192	1155.00	2026-07-11	\N	t	2026-07-11 13:47:14.010992	2026-07-11 13:47:14.010992
106	73	1350443	VIRENDRA KUMAR	227384215	2496.00	2026-07-11	\N	t	2026-07-11 13:47:14.013449	2026-07-11 13:47:14.013449
107	84	1684114	YASHODA	227398223	1338.00	2026-07-11	\N	t	2026-07-11 13:47:14.015582	2026-07-11 13:47:14.015582
\.


--
-- Data for Name: maintenance_charges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_charges (id, property_no, owner_name, sector, plot_no, charge_year, charge_month, amount, penalty_amount, due_date, paid_date, receipt_no, payment_mode, status, remarks, is_active, created_at, updated_at, charge_from_date, charge_to_date) FROM stdin;
1	A101RGN	Amit Saini	Sector-02	A101	2025	\N	358.56	20.00	2026-12-31	2026-07-03	MC-MR5FHFT3	cash	paid	Auto-generated [Annual] 2025-01-16 to 2025-12-30 | Area: 1250.00 sqft | Developed: 349 days × ₹0.30/sqft/yr = ₹358.562 | Test Demand Generated	t	2026-07-03 21:00:49.892792	2026-07-03 21:11:12.009	\N	\N
3	G3/3972	Chandan Kumar	3	P1/234	2022	\N	367.99	300.00	2023-01-15	\N	\N	\N	pending	Auto-generated [Annual] 2022-01-01 to 2022-12-30 | Area: 1230.00 sqft | Developed: 364 days × ₹0.30/sqft/yr = ₹367.989	t	2026-07-03 22:05:10.708378	2026-07-03 22:05:10.708378	2022-01-01	2022-12-30
4	G3/3972	Chandan Kumar	3	P1/234	2023	\N	369.00	200.00	2024-02-01	\N	\N	\N	overdue	Auto-generated [Annual] 2022-12-31 to 2023-12-30 | Area: 1230.00 sqft | Developed: 365 days × ₹0.30/sqft/yr = ₹369 | Notice issued on 2026-07-03	t	2026-07-03 22:06:11.047939	2026-07-03 22:23:16.744	2022-12-31	2023-12-30
2	A101RGN	Amit Saini	Sector-02	A101	2026	\N	343.15	0.00	2026-07-25	\N	\N	\N	overdue	Auto-generated [Annual] 2025-12-31 to 2026-12-30 | Area: 1250.00 sqft | Undeveloped: 90 days × ₹0.20/sqft/yr = ₹61.644 | Developed: 274 days × ₹0.30/sqft/yr = ₹281.507 | Notice issued on 2026-07-03 | Notice issued on 2026-07-03 | Notice issued on 2026-07-03	t	2026-07-03 21:08:03.206633	2026-07-03 22:33:28.016	\N	\N
5	G3/3972	Chandan Kumar	3	P1/234	2024	\N	370.01	100.00	2024-12-31	\N	\N	\N	pending	Auto-generated [Annual] 2023-12-31 to 2024-12-30 | Area: 1230.00 sqft | Developed: 366 days × ₹0.30/sqft/yr = ₹370.011	t	2026-07-04 08:48:46.38329	2026-07-04 08:48:46.38329	2023-12-31	2024-12-30
6	A101RGN	Amit Saini	Sector-02	A101	2026	\N	483.90	0.00	\N	\N	\N	\N	pending	Auto-generated [Annual] 2025-12-31 to 2026-12-30 | Area: 1250.00 sqft | Undeveloped: 90 days × ₹0.20/sqft/yr = ₹61.644 | Developed: 274 days × ₹0.45/sqft/yr = ₹422.26	t	2026-07-11 12:06:46.991545	2026-07-11 12:06:46.991545	2025-12-31	2026-12-30
\.


--
-- Data for Name: maintenance_properties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_properties (id, property_no, owner_name, owner_phone, owner_email, sector, colony_name, plot_no, flat_no, property_type, area, allotment_date, address, is_active, created_at, updated_at, is_possession, possession_date, is_developed, developed_date, property_code, father_name, layout_no, category, sector_block, final_registry_date, is_cancelled) FROM stdin;
2	R23/9276	ANKUR BANSAL	XXXX-XX-0002	\N	3	\N	1	\N	commercial	1500.00	\N	\N	t	2026-07-03 21:19:23.767655	2026-07-03 21:19:23.767655	f	\N	f	\N	R23/9276	R P BANSAL	\N	SHOP	3/NA	\N	f
16	R23/8292	SURENDRA KUMAR	XXXX-XX-9902	\N	3	\N	12	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.861388	2026-07-03 21:19:23.861388	t	2022-04-13	f	\N	R23/8292	JAIDEV PRASAD GUPTA	\N	B-1	3/NA	2022-04-13	f
3	R23/9266	HARDYAL	XXXX-XX-9429	\N	3	\N	14	\N	commercial	1125.00	\N	\N	t	2026-07-03 21:19:23.805488	2026-07-03 21:19:23.805488	t	2021-09-07	f	\N	R23/9266	POORAN LAL	\N	SHOP	3/NA	2021-09-07	f
17	R23/8293	NITIN KUMAR PRABHAKAR	\N	\N	3	\N	13	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.864276	2026-07-03 21:19:23.864276	t	2022-05-17	f	\N	R23/8293	MAHENDRA JAIN	\N	B-1	3/NA	2022-05-17	f
15	R23/6479	RAJUL GUPTA	\N	\N	3	\N	11	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.858293	2026-07-03 21:19:23.858293	f	\N	f	\N	R23/6479	\N	\N	B-1	3/NA	\N	f
224	R23/10679	Vacant	\N	\N	3	\N	78	\N	residential	780.00	\N	\N	t	2026-07-03 21:19:24.497631	2026-07-03 21:19:24.497631	f	\N	f	\N	R23/10679	\N	78	B-2	3/NA	\N	f
430	R23/8801	UDAI SINGH	\N	\N	3	\N	133	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.08527	2026-07-03 21:19:25.08527	t	2023-08-09	f	\N	R23/8801	MAHESH SINGH	\N	C-2	3/NA	2023-08-09	f
634	R23/8844	KAMINI SHARMA	\N	\N	3	\N	33	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.687469	2026-07-03 21:19:25.687469	f	\N	f	\N	R23/8844	\N	\N	C-2	3/NA	\N	f
18	R23/8294	SUMIT SINGH	XXXX-XX-4501	\N	3	\N	13A	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.866925	2026-07-03 21:19:23.866925	t	2018-12-28	f	\N	R23/8294	NIRANKAR SEV SETH	\N	B-1	3/NA	2018-12-28	f
19	R23/8295	MEGHA KRISHNA	XXXX-XX-5633	\N	3	\N	13B	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.870174	2026-07-03 21:19:23.870174	t	2021-09-21	f	\N	R23/8295	VINAY KRISHNA	\N	B-1	3/NA	2021-09-21	f
4	R23/9265	VIKRAM GANGWAR	XXXX-XX-7475	\N	3	\N	4	\N	commercial	1500.00	\N	\N	t	2026-07-03 21:19:23.817128	2026-07-03 21:19:23.817128	t	2022-05-18	f	\N	R23/9265	NATHU LAL GANGWAR	\N	SHOP	3/NA	2022-05-18	f
20	R23/8296	RAMESH KUMAR SAXENA	XXXX-XX-1586	\N	3	\N	13C	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.872877	2026-07-03 21:19:23.872877	t	2018-12-05	f	\N	R23/8296	R K SAXENA	\N	B-1	3/NA	2018-12-05	f
21	R23/6482	SHWETA SINGH	XXXX-XX-3644	\N	3	\N	13D	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.875734	2026-07-03 21:19:23.875734	f	\N	f	\N	R23/6482	\N	\N	B-1	3/NA	\N	f
22	R23/3243	MANEET KHANNA	XXXX-XX-8602	\N	3	\N	13E	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.878465	2026-07-03 21:19:23.878465	t	2023-12-08	f	\N	R23/3243	T.S. KHANNA	13E	B-1	3/NA	2023-12-08	f
23	R23/6485	ABHIMANUE GUPTA	\N	\N	3	\N	13F	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.882247	2026-07-03 21:19:23.882247	f	\N	f	\N	R23/6485	MUKESH KUMAR GUPTA	\N	B-1	3/NA	\N	f
24	R23/8297	HARISH KUMAR	XXXX-XX-3536	\N	3	\N	13G	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.885461	2026-07-03 21:19:23.885461	t	2022-08-02	f	\N	R23/8297	TIRATH DASS	\N	B-1	3/NA	2022-08-02	f
25	R23/6487	VEENA GARG	\N	\N	3	\N	14	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.888299	2026-07-03 21:19:23.888299	f	\N	f	\N	R23/6487	\N	\N	B-1	3/NA	\N	f
26	R23/8914	RAJESHWARI DEVI	\N	\N	3	\N	15	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.892084	2026-07-03 21:19:23.892084	t	2022-01-01	f	\N	R23/8914	\N	\N	B-1	3/NA	2022-01-01	f
27	R23/8947	MANJU SHARMA	XXXX-XX-5274	\N	3	\N	150	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:23.895285	2026-07-03 21:19:23.895285	f	\N	f	\N	R23/8947	PREM CHANDRA SHARMA	\N	B-1	3/NA	\N	f
28	R23/2592	DEEPAK CHARAN	XXXX-XX-8326	\N	3	\N	16	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.898608	2026-07-03 21:19:23.898608	t	2025-01-17	f	\N	R23/2592	\N	16	B-1	3/NA	2025-01-17	f
29	R23/8298	SUMAN LATA	XXXX-XX-2630	\N	3	\N	17	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.901942	2026-07-03 21:19:23.901942	t	2023-05-06	f	\N	R23/8298	HARIOM GAUR	\N	B-1	3/NA	2023-05-06	f
30	R23/8299	RANVEER SINGH	XXXX-XX-6390	\N	3	\N	18	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.904732	2026-07-03 21:19:23.904732	t	2022-05-28	f	\N	R23/8299	TARSEM SINGH	\N	B-1	3/NA	2022-05-28	f
31	R23/6469	DEEPIKA MISHRA	XXXX-XX-9348	\N	3	\N	2	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.908074	2026-07-03 21:19:23.908074	t	2025-03-29	f	\N	R23/6469	\N	\N	B-1	3/NA	2025-03-29	f
32	R23/10706	SUNIL KUMAR	XXXX-XX-5144	\N	3	\N	20	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.911872	2026-07-03 21:19:23.911872	t	2025-04-23	f	\N	R23/10706	LATE TARA CHAND	20	B-1	3/NA	2025-04-23	f
33	R23/6490	PRAMOD KUMAR GUPTA	\N	\N	3	\N	21	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.914905	2026-07-03 21:19:23.914905	f	\N	f	\N	R23/6490	PRAMOD KUMAR GUPTA	\N	B-1	3/NA	\N	f
34	R23/6470	MEENA DEVI	\N	\N	3	\N	22	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.917422	2026-07-03 21:19:23.917422	f	\N	f	\N	R23/6470	\N	\N	B-1	3/NA	\N	f
35	R23/8301	SANJAY KUMAR	XXXX-XX-7903	\N	3	\N	23	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.920632	2026-07-03 21:19:23.920632	t	2022-03-07	f	\N	R23/8301	MANOHAR LAL GANGWAR	\N	B-1	3/NA	2022-03-07	f
36	R23/8915	ARUN MELHOTRA	\N	\N	3	\N	24	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.923308	2026-07-03 21:19:23.923308	t	2022-04-26	f	\N	R23/8915	MOOL CHAND MALHOTRA	\N	B-1	3/NA	2022-04-26	f
37	R23/10707	ADITYA GANGWAR	XXXX-XX-9908	\N	3	\N	25	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.925967	2026-07-03 21:19:23.925967	f	\N	f	\N	R23/10707	HARISH CHANDRA GANGWAR	25	B-1	3/NA	\N	f
38	R23/2587	SUNIL KUMAR AGARWAL	XXXX-XX-7018	\N	3	\N	26	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.928658	2026-07-03 21:19:23.928658	t	2025-03-29	f	\N	R23/2587	\N	26	B-1	3/NA	2025-03-29	f
39	R23/2907	CHARU MAHESHWARI	XXXX-XX-4200	\N	3	\N	27	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.932151	2026-07-03 21:19:23.932151	f	\N	f	\N	R23/2907	\N	27	B-1	3/NA	\N	f
40	R23/2910	DARSHAN MEHRA	XXXX-XX-5210	\N	3	\N	28	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.935245	2026-07-03 21:19:23.935245	t	2025-02-13	f	\N	R23/2910	\N	28	B-1	3/NA	2025-02-13	f
41	R23/6497	KALPANA AGARWAL	XXXX-XX-6628	\N	3	\N	29	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.938007	2026-07-03 21:19:23.938007	f	\N	f	\N	R23/6497	\N	\N	B-1	3/NA	\N	f
42	R23/2913	PREMIER AGRI FOODS PVT DIRCTOR JAGMOHAN GUPTA	XXXX-XX-7870	\N	3	\N	30	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.941233	2026-07-03 21:19:23.941233	f	\N	f	\N	R23/2913	\N	30	B-1	3/NA	\N	f
43	R23/10708	HEMENDRA SINGH	XXXX-XX-0756	\N	3	\N	30A	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.944472	2026-07-03 21:19:23.944472	f	\N	f	\N	R23/10708	RAMRAJ SINGH	30A	B-1	3/NA	\N	f
44	R23/6552	PAWAN CHAUHAN	XXXX-XX-7294	\N	3	\N	31	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.94717	2026-07-03 21:19:23.94717	f	\N	f	\N	R23/6552	BABURAM CHAUHAN	\N	B-1	3/NA	\N	f
45	R23/6558	DINESH CHAUHAN	XXXX-XX-6122	\N	3	\N	32	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.949855	2026-07-03 21:19:23.949855	f	\N	f	\N	R23/6558	KISHAN SINGH CHAUHAN	\N	B-1	3/NA	\N	f
46	R23/8913	SUMIT AGARWAL	\N	\N	3	\N	33	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.952632	2026-07-03 21:19:23.952632	t	2024-10-15	f	\N	R23/8913	SHIV KUMAR AGARWAL	\N	B-1	3/NA	2024-10-15	f
47	R23/4135	PUSHPA KRISHNAM	\N	\N	3	\N	34	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.956061	2026-07-03 21:19:23.956061	f	\N	f	\N	R23/4135	\N	34	B-1	3/NA	\N	f
48	R23/6560	MANISH MATHRIA	XXXX-XX-7443	\N	3	\N	35	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.958912	2026-07-03 21:19:23.958912	f	\N	f	\N	R23/6560	G L MATHURIA	\N	B-1	3/NA	\N	f
49	R23/8912	NEHA KHEMKA	\N	\N	3	\N	36	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.961778	2026-07-03 21:19:23.961778	f	\N	f	\N	R23/8912	VISHNU KANT KHEMKA	\N	B-1	3/NA	\N	f
50	R23/8938	NEELIMA GUPTA	\N	\N	3	\N	37	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.964524	2026-07-03 21:19:23.964524	t	2025-03-20	f	\N	R23/8938	\N	\N	B-1	3/NA	2025-03-20	f
51	R23/8302	PRIYANK KHANDELWAL	XXXX-XX-0977	\N	3	\N	38	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.967908	2026-07-03 21:19:23.967908	t	2018-08-24	f	\N	R23/8302	DILEEP KHANDELWAL	\N	B-1	3/NA	2018-08-24	f
768	R23/6808	PRANKUR SAXENA	\N	\N	3	\N	57	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.058855	2026-07-03 21:19:26.058855	f	\N	f	\N	R23/6808	R C SAXENA	\N	C-2	3/NA	\N	f
52	R23/6578	ASHOK KUMAR CHAWLA	XXXX-XX-0110	\N	3	\N	39	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.970649	2026-07-03 21:19:23.970649	f	\N	f	\N	R23/6578	MANHOR LAL CHAWLA	\N	B-1	3/NA	\N	f
53	R23/6582	VINEET GUPTA	XXXX-XX-0074	\N	3	\N	40	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.980167	2026-07-03 21:19:23.980167	f	\N	f	\N	R23/6582	SATISH BABU GUPTA	\N	B-1	3/NA	\N	f
54	R23/8303	ANIL KUMAR SINGH	XXXX-XX-6466	\N	3	\N	41	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.983361	2026-07-03 21:19:23.983361	t	2023-09-20	f	\N	R23/8303	NARENDRA SINGH	\N	B-1	3/NA	2023-09-20	f
55	R23/6584	AJAY KUMAR JAIN	XXXX-XX-1292	\N	3	\N	42	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.986672	2026-07-03 21:19:23.986672	t	2025-03-07	f	\N	R23/6584	CHANMAN LAL JAIN	\N	B-1	3/NA	2025-03-07	f
56	R23/9803	NAVJOT SINGH	XXXX-XX-4394	\N	3	\N	43	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.990208	2026-07-03 21:19:23.990208	f	\N	f	\N	R23/9803	JOGINDER SINGH	\N	B-1	3/NA	\N	f
57	R23/8285	CHANDAN PRAKASH	XXXX-XX-9170	\N	3	\N	44	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.993605	2026-07-03 21:19:23.993605	t	2024-03-16	f	\N	R23/8285	RAM ASREY LAL	\N	B-1	3/NA	2024-03-16	f
58	R23/4426	VINOD KUMAR	XXXX-XX-1074	\N	3	\N	45	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.99654	2026-07-03 21:19:23.99654	t	2024-03-16	f	\N	R23/4426	VETNARY OFFICER	45	B-1	3/NA	2024-03-16	f
59	R23/4026	BHAVANA AGARWAL	XXXX-XX-8588	\N	3	\N	46	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.999342	2026-07-03 21:19:23.999342	t	2024-11-29	f	\N	R23/4026	PANKAJ KUMAR	46	B-1	3/NA	2024-11-29	f
60	R23/6588	P K AGARWAL	\N	\N	3	\N	47	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.002227	2026-07-03 21:19:24.002227	f	\N	f	\N	R23/6588	BISHAN LAL AGARWAL	\N	B-1	3/N.A.	\N	f
61	R23/10709	AMIT MISHRA	XXXX-XX-5998	\N	3	\N	47A	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.005578	2026-07-03 21:19:24.005578	f	\N	f	\N	R23/10709	KESHAV DATTA MISHRA	47A	B-1	3/NA	\N	f
62	R23/4235	KAVITA RANI	\N	\N	3	\N	48	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.0091	2026-07-03 21:19:24.0091	t	2024-03-20	f	\N	R23/4235	\N	48	B-1	3/NA	2024-03-20	f
63	R23/6591	MONIKA SHARMA	XXXX-XX-6988	\N	3	\N	49	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.011825	2026-07-03 21:19:24.011825	t	2025-02-13	f	\N	R23/6591	\N	\N	B-1	3/NA	2025-02-13	f
64	R23/6593	SHRADDHA MAHESHWARI	XXXX-XX-7399	\N	3	\N	49A	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.014579	2026-07-03 21:19:24.014579	f	\N	f	\N	R23/6593	RITESH MAHESHWARI	\N	B-1	3/NA	\N	f
65	R23/10710	AKASH KUMAR GUPTA	XXXX-XX-7762	\N	3	\N	49B	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.017888	2026-07-03 21:19:24.017888	f	\N	f	\N	R23/10710	SHIV KUMAR GUPTA	49B	B-1	3/NA	\N	f
66	R23/6594	RAJ KUMAR GUPTA	XXXX-XX-9185	\N	3	\N	49C	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.020725	2026-07-03 21:19:24.020725	f	\N	f	\N	R23/6594	CHANDRA BHAN GUPTA	\N	B-1	3/NA	\N	f
67	R23/8937	RITESH AGARWAL	\N	\N	3	\N	49D	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.023341	2026-07-03 21:19:24.023341	f	\N	f	\N	R23/8937	D K AGARWAL	\N	B-1	3/NA	\N	f
68	R23/6472	ARUN SHARMA	XXXX-XX-9992	\N	3	\N	5	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.026041	2026-07-03 21:19:24.026041	f	\N	f	\N	R23/6472	SHIV SHANKAR SHAMA	\N	B-1	3/NA	\N	f
69	R23/9806	VIKRAM GANGWAR	XXXX-XX-7475	\N	3	\N	50	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.029254	2026-07-03 21:19:24.029254	t	2025-04-25	f	\N	R23/9806	NATTHU LAL GANGWAR	\N	B-1	3/NA	2025-04-25	f
70	R23/2601	ANKITA BAJPAI	XXXX-XX-2873	\N	3	\N	51	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.032065	2026-07-03 21:19:24.032065	t	2025-02-13	f	\N	R23/2601	\N	51	B-1	3/NA	2025-02-13	f
71	R23/2604	SAKSHI GUPTA	XXXX-XX-1000	\N	3	\N	52	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.03483	2026-07-03 21:19:24.03483	t	2024-07-27	f	\N	R23/2604	\N	52	B-1	3/NA	2024-07-27	f
72	R23/6599	MAQSUD E NAZAR	XXXX-XX-3181	\N	3	\N	53	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.037771	2026-07-03 21:19:24.037771	t	2025-02-13	f	\N	R23/6599	MOHD ZAFAR	\N	B-1	3/NA	2025-02-13	f
73	R23/6601	SARVESH AGARWAL	XXXX-XX-5678	\N	3	\N	54	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.041289	2026-07-03 21:19:24.041289	t	2024-10-05	f	\N	R23/6601	CHATER JAIN	\N	B-1	3/NA	2024-10-05	f
74	R23/6605	SEEMA JAIN	XXXX-XX-8788	\N	3	\N	55	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.044273	2026-07-03 21:19:24.044273	t	2025-06-02	f	\N	R23/6605	R M AGARWAL	\N	B-1	3/NA	2025-06-02	f
75	R23/6607	SANJEEV KUMAR	XXXX-XX-0752	\N	3	\N	56	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.047085	2026-07-03 21:19:24.047085	f	\N	f	\N	R23/6607	BADRI PRASAD AGARWAL	\N	B-1	3/NA	\N	f
76	R23/8304	SANJAY KUMAR AGARWAL	XXXX-XX-4304	\N	3	\N	57	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.050061	2026-07-03 21:19:24.050061	t	2023-03-22	f	\N	R23/8304	M C AGARWAL	\N	B-1	3/NA	2023-03-22	f
77	R23/2916	RAM SINGH	XXXX-XX-6354	\N	3	\N	58	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.055273	2026-07-03 21:19:24.055273	t	2023-10-24	f	\N	R23/2916	\N	58	B-1	3/NA	2023-10-24	f
78	R23/8229	SANJAY KRISHNANA	\N	\N	3	\N	59	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.058103	2026-07-03 21:19:24.058103	t	2024-02-24	f	\N	R23/8229	S G KRISHANANA	59	B-1	3/NA	2024-02-24	f
79	R23/8305	OMENDRA PAL SINGH	XXXX-XX-4945	\N	3	\N	60	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.060898	2026-07-03 21:19:24.060898	t	2022-08-05	f	\N	R23/8305	HARI RAJ SINGH	\N	B-1	3/NA	2022-08-05	f
80	R23/8917	JITENDRA DEV GANGWAR	\N	\N	3	\N	61	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.063648	2026-07-03 21:19:24.063648	t	2004-03-02	f	\N	R23/8917	NEERAJ SRIVASTAVA	\N	B-1	3/NA	2004-03-02	f
81	R23/8911	DHARMENDRA CHOWDHARY	\N	\N	3	\N	62	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.075123	2026-07-03 21:19:24.075123	f	\N	f	\N	R23/8911	PURANMANSHI DEEN	\N	B-1	3/NA	\N	f
82	R23/6609	AJAY KUMAR AGARWAL	XXXX-XX-5432	\N	3	\N	62	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.078241	2026-07-03 21:19:24.078241	f	\N	f	\N	R23/6609	SHANKAR LAL	\N	B-1	3/N.A.	\N	f
83	R23/6611	MANISHA MENDIRATTA	XXXX-XX-3338	\N	3	\N	64	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.081346	2026-07-03 21:19:24.081346	f	\N	f	\N	R23/6611	PRADEEP KUMAR MENDIRATTA	\N	B-1	3/NA	\N	f
84	R23/2733	RAJPAL	XXXX-XX-3531	\N	3	\N	65	\N	residential	2936.80	\N	\N	t	2026-07-03 21:19:24.084156	2026-07-03 21:19:24.084156	t	2023-07-22	f	\N	R23/2733	\N	65	B-1	3/NA	2023-07-22	f
85	R23/8935	KALPANA	XXXX-XX-2801	\N	3	\N	66	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.086783	2026-07-03 21:19:24.086783	t	2024-10-28	f	\N	R23/8935	ROHIT SINGH	\N	B-1	3/NA	2024-10-28	f
86	R23/8307	PRATIBA RANI	XXXX-XX-5407	\N	3	\N	67	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.08953	2026-07-03 21:19:24.08953	t	2022-07-23	f	\N	R23/8307	\N	\N	B-1	3/NA	2022-07-23	f
87	R23/8306	ASHUTOSH KHANDELWAL	XXXX-XX-3229	\N	3	\N	68	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.092861	2026-07-03 21:19:24.092861	t	2022-07-26	f	\N	R23/8306	VINOD KUMAR KHANDELWAL	\N	B-1	3/NA	2022-07-26	f
88	R23/10711	PRASTUTI GUPTA	XXXX-XX-6353	\N	3	\N	69	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.09589	2026-07-03 21:19:24.09589	f	\N	f	\N	R23/10711	\N	69	B-1	3/NA	\N	f
89	R23/8936	KUMAR MANISH SINGH	XXXX-XX-8918	\N	3	\N	70	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.099264	2026-07-03 21:19:24.099264	t	2024-08-23	f	\N	R23/8936	RAM SINGH	\N	B-1	3/NA	2024-08-23	f
90	R23/7842	ULTRAAGRITECH	XXXX-XX-3301	\N	3	\N	71	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.102186	2026-07-03 21:19:24.102186	f	\N	f	\N	R23/7842	\N	\N	B-1	3/NA	\N	f
91	R23/10712	ANITA KALRA	XXXX-XX-4440	\N	3	\N	72	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.105468	2026-07-03 21:19:24.105468	f	\N	f	\N	R23/10712	\N	72	B-1	3/NA	\N	f
92	R23/2626	SHIKHAR PAL SINGH	XXXX-XX-5815	\N	3	\N	73	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.108635	2026-07-03 21:19:24.108635	t	2025-03-07	f	\N	R23/2626	SHIV PAL SINGH	73	B-1	3/NA	2025-03-07	f
93	R23/7838	SEJAL SINGH	XXXX-XX-5180	\N	3	\N	74	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.111454	2026-07-03 21:19:24.111454	f	\N	f	\N	R23/7838	\N	\N	B-1	3/NA	\N	f
94	R23/2618	ATUL KUMAR AGARWAL	XXXX-XX-9810	\N	3	\N	75	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.114141	2026-07-03 21:19:24.114141	t	2025-03-29	f	\N	R23/2618	\N	75	B-1	3/NA	2025-03-29	f
95	R23/7840	ROHTASH KUMAR	XXXX-XX-5180	\N	3	\N	76	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.117215	2026-07-03 21:19:24.117215	f	\N	f	\N	R23/7840	HOTI LAL	\N	B-1	3/NA	\N	f
96	R23/2629	SURAJ BHAN SINGH YADAV	XXXX-XX-0617	\N	3	\N	77	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.120124	2026-07-03 21:19:24.120124	f	\N	f	\N	R23/2629	\N	77	B-1	3/NA	\N	f
98	R23/9801	SARTHAK GOEL	XXXX-XX-9990	\N	3	\N	79	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.125299	2026-07-03 21:19:24.125299	f	\N	f	\N	R23/9801	KAMAL GOEL	\N	B-1	3/NA	\N	f
99	R23/2632	VINOD KUMAR VAISH	XXXX-XX-8375	\N	3	\N	80	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.128528	2026-07-03 21:19:24.128528	f	\N	f	\N	R23/2632	\N	80	B-1	3/NA	\N	f
100	R23/6476	ASHOK KUMAR	XXXX-XX-3644	\N	3	\N	9	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.131717	2026-07-03 21:19:24.131717	f	\N	f	\N	R23/6476	DULI RAM	\N	B-1	3/NA	\N	f
101	R23/8943	SHAKUNTALA AGARWAL	\N	\N	3	\N	29	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.134353	2026-07-03 21:19:24.134353	f	\N	f	\N	R23/8943	SHIV KUMAR AGARWAL	\N	B-2	3/NA	\N	f
102	R23/6630	ATUL KUMAR AGARWAL	XXXX-XX-2088	\N	3	\N	01	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.137152	2026-07-03 21:19:24.137152	f	\N	f	\N	R23/6630	\N	\N	B-2	3/NA	\N	f
103	R23/8941	SUMIT GUPTA	\N	\N	3	\N	02	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.140335	2026-07-03 21:19:24.140335	f	\N	f	\N	R23/8941	NARENDRA KUMAR GUPTA	\N	B-2	3/NA	\N	f
104	R23/8375	DEVENDRA SINGH	XXXX-XX-2112	\N	3	\N	03	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.143393	2026-07-03 21:19:24.143393	t	2022-07-23	f	\N	R23/8375	S SATWABT SINGH	03	B-2	3/NA	2022-07-23	f
105	R23/5064	ANITA MUKESH	XXXX-XX-2727	\N	3	\N	03	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.146329	2026-07-03 21:19:24.146329	f	\N	f	\N	R23/5064	\N	03	B-2	3/N.A.	\N	f
106	R23/8338	SONIA SURI	XXXX-XX-8711	\N	3	\N	04	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.149025	2026-07-03 21:19:24.149025	t	2022-08-24	f	\N	R23/8338	PANKAJ SURI	04	B-2	3/NA	2022-08-24	f
107	R23/8339	NITIN KUMAR PRABHAKAR	XXXX-XX-5161	\N	3	\N	05	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.15273	2026-07-03 21:19:24.15273	t	2021-08-10	f	\N	R23/8339	HANS RAJ AHUJA	05	B-2	3/NA	2021-08-10	f
108	R23/8341	GULAB SINGH	XXXX-XX-4619	\N	3	\N	06	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.161771	2026-07-03 21:19:24.161771	t	2022-03-02	f	\N	R23/8341	DOONGAR SINGH	\N	B-2	3/NA	2022-03-02	f
109	R23/8342	VINAY KUMAR	XXXX-XX-6225	\N	3	\N	08	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.164903	2026-07-03 21:19:24.164903	t	2021-08-19	f	\N	R23/8342	DEVI PRASAD SINGH	08	B-2	3/NA	2021-08-19	f
110	R23/8235	SUCHI AGARWAL	XXXX-XX-6019	\N	3	\N	09	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.167877	2026-07-03 21:19:24.167877	t	2022-11-11	f	\N	R23/8235	HARMESH SINGH	09	B-2	3/NA	2022-11-11	f
111	R23/8376	BHATAT BHUSHAN	XXXX-XX-5462	\N	3	\N	10	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.171101	2026-07-03 21:19:24.171101	t	2022-12-27	f	\N	R23/8376	KUNWAR SEN	10	B-2	3/NA	2022-12-27	f
112	R23/8924	ANJU SIDANA	\N	\N	3	\N	100	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.174052	2026-07-03 21:19:24.174052	t	2024-05-21	f	\N	R23/8924	INDER SIDANA	\N	B-2	3/NA	2024-05-21	f
113	R23/8231	NEETA JOSHI	XXXX-XX-6661	\N	3	\N	101	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.176868	2026-07-03 21:19:24.176868	t	2023-01-21	f	\N	R23/8231	\N	101	B-2	3/NA	2023-01-21	f
114	R23/8921	SUNEETA	\N	\N	3	\N	102	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.179906	2026-07-03 21:19:24.179906	t	2022-08-05	f	\N	R23/8921	SEWAK RAM	\N	B-2	3/NA	2022-08-05	f
115	R23/8948	NARESH CHANDRA DEV	\N	\N	3	\N	103	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.183342	2026-07-03 21:19:24.183342	t	2024-12-12	f	\N	R23/8948	S D E	\N	B-2	3/NA	2024-12-12	f
116	R23/8939	RAMNATH GABA	\N	\N	3	\N	104	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.186775	2026-07-03 21:19:24.186775	f	\N	f	\N	R23/8939	JAIRAM DASS GABA	\N	B-2	3/NA	\N	f
117	R23/8940	AJAY VEER SINGH	\N	\N	3	\N	105	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.191307	2026-07-03 21:19:24.191307	t	2024-07-06	f	\N	R23/8940	\N	\N	B-2	3/NA	2024-07-06	f
118	R23/8384	ANAND KUMAR THAKUR	XXXX-XX-5515	\N	3	\N	106	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.194711	2026-07-03 21:19:24.194711	t	2022-07-12	f	\N	R23/8384	B S THAKUR	106	B-2	3/NA	2022-07-12	f
119	R23/6779	SMITA KARNATAK	XXXX-XX-3770	\N	3	\N	107	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.198006	2026-07-03 21:19:24.198006	f	\N	f	\N	R23/6779	\N	\N	B-2	3/NA	\N	f
120	R23/8334	BEENA SAXENA	XXXX-XX-6057	\N	3	\N	108	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.20098	2026-07-03 21:19:24.20098	t	2022-06-25	f	\N	R23/8334	D K SAXENA	108	B-2	3/NA	2022-06-25	f
121	R23/6776	DHARMENDRA PAL SINGH	XXXX-XX-7968	\N	3	\N	109	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.203404	2026-07-03 21:19:24.203404	f	\N	f	\N	R23/6776	LALAI RAM	\N	B-2	3/NA	\N	f
122	R23/8343	AVINASH JOHRI	\N	\N	3	\N	11	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.207021	2026-07-03 21:19:24.207021	t	2021-02-23	f	\N	R23/8343	PRABHASN CHANDRA	\N	B-2	3/NA	2021-02-23	f
123	R23/6625	AKASH GUPTA	XXXX-XX-1222	\N	3	\N	110	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.210194	2026-07-03 21:19:24.210194	f	\N	f	\N	R23/6625	PRAMOD KUMAR GUPTA	\N	B-2	3/NA	\N	f
124	R23/6766	SUNIL KUMAR GUPTA	XXXX-XX-7072	\N	3	\N	111	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.213057	2026-07-03 21:19:24.213057	f	\N	f	\N	R23/6766	M C GUPTA	\N	B-2	3/NA	\N	f
125	R23/8922	ANITA MUKESH	XXXX-XX-2727	\N	3	\N	112	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.215737	2026-07-03 21:19:24.215737	t	2024-05-30	f	\N	R23/8922	MUKESH KUMA	\N	B-2	3/NA	2024-05-30	f
126	R23/8335	SAVITA RATHOR	XXXX-XX-2100	\N	3	\N	113	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.21826	2026-07-03 21:19:24.21826	t	2022-05-26	f	\N	R23/8335	KULDEEP SINGH	113	B-2	3/NA	2022-05-26	f
127	R23/8336	JITENDRA BHATIA	XXXX-XX-9996	\N	3	\N	114	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.221538	2026-07-03 21:19:24.221538	t	2021-03-20	f	\N	R23/8336	ALOK BHATIA	114	B-2	3/NA	2021-03-20	f
128	R23/4302	ROTARY CLUB OF BAREILLY CHARITABLE TRUST	XXXX-XX-3336	\N	3	\N	115	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.22427	2026-07-03 21:19:24.22427	t	2025-01-17	f	\N	R23/4302	\N	115	B-2	3/NA	2025-01-17	f
129	R23/8344	RITU SAXENA	\N	\N	3	\N	12	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.226943	2026-07-03 21:19:24.226943	t	2021-12-14	f	\N	R23/8344	SANJAY KUMAR SAXENA	\N	B-2	3/NA	2021-12-14	f
130	R23/3169	KARAN SINGH	XXXX-XX-6114	\N	3	\N	13	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.229726	2026-07-03 21:19:24.229726	f	\N	f	\N	R23/3169	GAREB DAS	13	B-2	3/NA	\N	f
131	R23/6978	HEMANT SINGH	XXXX-XX-5609	\N	3	\N	136	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.232731	2026-07-03 21:19:24.232731	f	\N	f	\N	R23/6978	GAJENDRA SINGH	\N	B-2	3/NA	\N	f
132	R23/4325	SUNITA GOSWAMI	XXXX-XX-6646	\N	3	\N	137	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.235296	2026-07-03 21:19:24.235296	t	2024-10-07	f	\N	R23/4325	\N	137	B-2	3/NA	2024-10-07	f
133	R23/6981	SHUSHANT SINGH	XXXX-XX-5807	\N	3	\N	138	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.237792	2026-07-03 21:19:24.237792	f	\N	f	\N	R23/6981	OM PRAKASH JATAV	\N	B-2	3/NA	\N	f
134	R23/6617	JAI CHAWALA	XXXX-XX-2547	\N	3	\N	139	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.240539	2026-07-03 21:19:24.240539	t	2024-11-21	f	\N	R23/6617	JITENDRA KUMAR CHAWALA	\N	B-2	3/NA	2024-11-21	f
135	R23/8345	PANKAJ SAHDEV	XXXX-XX-4412	\N	3	\N	14	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.243667	2026-07-03 21:19:24.243667	t	2020-08-21	f	\N	R23/8345	C P SAHDEV	\N	B-2	3/NA	2020-08-21	f
136	R23/3210	VIVEK KUMAR	XXXX-XX-2125	\N	3	\N	140	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.246371	2026-07-03 21:19:24.246371	t	2023-09-23	f	\N	R23/3210	JAMUNA PRASAD GANGWAR	140	B-2	3/N.A.	2023-09-23	f
137	R23/8942	SARVESH KUMAR ARYA	XXXX-XX-4758	\N	3	\N	141	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.249341	2026-07-03 21:19:24.249341	t	2025-05-28	f	\N	R23/8942	KARAN LAL	\N	B-2	3/NA	2025-05-28	f
138	R23/6623	SANGEETA SAGAR	XXXX-XX-6007	\N	3	\N	143	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.252708	2026-07-03 21:19:24.252708	t	2025-01-30	f	\N	R23/6623	\N	\N	B-2	3/NA	2025-01-30	f
139	R23/6615	HIRDESH KUMAR SINGH	XXXX-XX-7432	\N	3	\N	144	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.256391	2026-07-03 21:19:24.256391	f	\N	f	\N	R23/6615	SATYA PAL SINGH YADAV	\N	B-2	3/NA	\N	f
140	R23/8946	MOHD SHUFIYAN ALI	XXXX-XX-8477	\N	3	\N	145	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.259319	2026-07-03 21:19:24.259319	t	2025-06-25	f	\N	R23/8946	MOHD ALI ANSARI	\N	B-2	3/NA	2025-06-25	f
141	R23/6031	VIKRAM GUPTA	XXXX-XX-7315	\N	3	\N	146	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.262052	2026-07-03 21:19:24.262052	f	\N	f	\N	R23/6031	ARVIND GUPTA	\N	B-2	3/NA	\N	f
142	R23/6619	JITENDRA KUMAR VERMA	XXXX-XX-1773	\N	3	\N	147	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.264801	2026-07-03 21:19:24.264801	f	\N	f	\N	R23/6619	RAKESH VERMA	\N	B-2	3/NA	\N	f
143	R23/4326	SAKSHI SHUKLA	XXXX-XX-5626	\N	3	\N	148	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.268083	2026-07-03 21:19:24.268083	t	2025-04-25	f	\N	R23/4326	\N	148	B-2	3/NA	2025-04-25	f
144	R23/4327	SWATI AGARWAL	XXXX-XX-6214	\N	3	\N	149	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.270921	2026-07-03 21:19:24.270921	f	\N	f	\N	R23/4327	\N	149	B-2	3/NA	\N	f
145	R23/8346	VNEETA SHARMA	XXXX-XX-4680	\N	3	\N	15	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.273426	2026-07-03 21:19:24.273426	t	2018-08-13	f	\N	R23/8346	SATYENDRA KUMAR SHARMA	15	B-2	3/NA	2018-08-13	f
146	R23/5234	MANJU SHARMA	\N	\N	3	\N	150	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.276065	2026-07-03 21:19:24.276065	f	\N	f	\N	R23/5234	\N	150	B-2	3/N.A.	\N	f
147	R23/8926	SANDHYA MATHUR	XXXX-XX-1539	\N	3	\N	151	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.27955	2026-07-03 21:19:24.27955	t	2024-05-03	f	\N	R23/8926	RAGHVENDRA SINGH	\N	B-2	3/NA	2024-05-03	f
148	R23/5173	ANKIT SHARMA	\N	\N	3	\N	152	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.282461	2026-07-03 21:19:24.282461	t	2024-07-22	f	\N	R23/5173	JAGAN NATH	152	B-2	3/NA	2024-07-22	f
149	R23/5331	NARENDRA PAL	XXXX-XX-8568	\N	3	\N	153	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.285068	2026-07-03 21:19:24.285068	t	2024-07-12	f	\N	R23/5331	RAM PAL	\N	B-2	3/NA	2024-07-12	f
150	R23/6624	BRIJ MOHAN SINGH	XXXX-XX-5134	\N	3	\N	154	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.287906	2026-07-03 21:19:24.287906	t	2025-01-30	f	\N	R23/6624	RAJESH KUMAR SAGAR	\N	B-2	3/NA	2025-01-30	f
151	R23/4329	KAMLESH VERMA	XXXX-XX-8819	\N	3	\N	155	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.291029	2026-07-03 21:19:24.291029	f	\N	f	\N	R23/4329	SHRAWAN KUMAR VERMA	155	B-2	3/NA	\N	f
152	R23/8347	SHIVAM AGARWAL	XXXX-XX-6205	\N	3	\N	15A	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.29362	2026-07-03 21:19:24.29362	t	2021-04-12	f	\N	R23/8347	SUBODH KUMAR	\N	B-2	3/NA	2021-04-12	f
153	R23/8348	VIVEKANAND	XXXX-XX-1634	\N	3	\N	15B	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.296969	2026-07-03 21:19:24.296969	t	2019-03-03	f	\N	R23/8348	DEVDUTTA	15B	B-2	3/NA	2019-03-03	f
154	R23/8349	SUNITA RAMSEY	XXXX-XX-7790	\N	3	\N	15C	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.299878	2026-07-03 21:19:24.299878	t	2019-07-23	f	\N	R23/8349	\N	15C	B-2	3/NA	2019-07-23	f
155	R23/6633	AMIT BHATI	XXXX-XX-5559	\N	3	\N	15D	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.303258	2026-07-03 21:19:24.303258	f	\N	f	\N	R23/6633	NAWAB SINGH BHATI	\N	B-2	3/NA	\N	f
156	R23/8350	SOM DUTT SHARMA	XXXX-XX-8694	\N	3	\N	15E	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.306967	2026-07-03 21:19:24.306967	t	2022-02-08	f	\N	R23/8350	SOHAN LAL SHARMA	15E	B-2	3/NA	2022-02-08	f
157	R23/6768	SHYAM SUNDER, POONAM DEVI	XXXX-XX-8843	\N	3	\N	15F	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.309452	2026-07-03 21:19:24.309452	t	2024-09-05	f	\N	R23/6768	MUNNEY LAL KANAUJIA	\N	B-2	3/NA	2024-09-05	f
158	R23/8351	SHIV KUMAR GANGWAR	XXXX-XX-6654	\N	3	\N	15G	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.31255	2026-07-03 21:19:24.31255	t	2019-05-06	f	\N	R23/8351	KANSHI RAM GANGWAR	15G	B-2	3/NA	2019-05-06	f
159	R23/8352	SAHIL ARORA	XXXX-XX-6222	\N	3	\N	15H	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.315554	2026-07-03 21:19:24.315554	t	2019-10-24	f	\N	R23/8352	ASHOK KUMAR ARORA	\N	B-2	3/NA	2019-10-24	f
160	R23/4331	SHAILESH KUMAR PANDEY	XXXX-XX-6168	\N	3	\N	15I	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.318392	2026-07-03 21:19:24.318392	f	\N	f	\N	R23/4331	NAGNARAYAN PANDEY	\N	B-2	3/NA	\N	f
161	R23/8377	RAMESH CHANDER SHARMA	XXXX-XX-0121	\N	3	\N	16	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.32121	2026-07-03 21:19:24.32121	t	2023-02-07	f	\N	R23/8377	JIWA NAND SHARMA	16	B-2	3/NA	2023-02-07	f
162	R23/6788	NAWAL KISHORE BHATT	XXXX-XX-3328	\N	3	\N	17	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.323975	2026-07-03 21:19:24.323975	f	\N	f	\N	R23/6788	KHIMA NAND BHATT	\N	B-2	3/NA	\N	f
163	R23/5320	VIKASH AGARWAL	XXXX-XX-4184	\N	3	\N	18	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.327121	2026-07-03 21:19:24.327121	t	2024-06-15	f	\N	R23/5320	MAHENDRA AGARWAL	\N	B-2	3/NA	2024-06-15	f
164	R23/8354	MAHENDRA PRATAP SINGH	XXXX-XX-1816	\N	3	\N	19	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.329616	2026-07-03 21:19:24.329616	t	2021-07-17	f	\N	R23/8354	CHUNNI RAM	19	B-2	3/NA	2021-07-17	f
165	R23/8355	ABHA SINGH BHARTI	XXXX-XX-0516	\N	3	\N	20	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.332334	2026-07-03 21:19:24.332334	t	2019-11-21	f	\N	R23/8355	SURENDRA PAL NAGLAKAR	20	B-2	3/NA	2019-11-21	f
166	R23/8356	SHANTI SINGH	XXXX-XX-9968	\N	3	\N	21	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.335027	2026-07-03 21:19:24.335027	t	2018-07-11	f	\N	R23/8356	DARA SINGH	21	B-2	3/NA	2018-07-11	f
167	R23/8378	RAJESH KUMAR	XXXX-XX-2913	\N	3	\N	22	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.337957	2026-07-03 21:19:24.337957	t	2022-09-06	f	\N	R23/8378	D P MANGAL	22	B-2	3/NA	2022-09-06	f
168	R23/8357	SOHAN LAL MISHRA	XXXX-XX-3814	\N	3	\N	23	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.341117	2026-07-03 21:19:24.341117	t	2021-07-13	f	\N	R23/8357	JAWALA PRASAD MISHRA	23	B-2	3/NA	2021-07-13	f
169	R23/8359	AMIT GOYAL	XXXX-XX-1165	\N	3	\N	24	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.343854	2026-07-03 21:19:24.343854	t	2022-08-31	f	\N	R23/8359	SURENDRA PRAKASH	24	B-2	3/NA	2022-08-31	f
170	R23/6783	AMITABH ARYA	XXXX-XX-4700	\N	3	\N	25	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.346503	2026-07-03 21:19:24.346503	f	\N	f	\N	R23/6783	DESH VRAT ARYA	\N	B-2	3/NA	\N	f
171	R23/8360	YOGESH KUMAR RASTOGI	XXXX-XX-2044	\N	3	\N	26	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.349536	2026-07-03 21:19:24.349536	t	2020-11-10	f	\N	R23/8360	SURESH CHANDRA RASTOGI	26	B-2	3/NA	2020-11-10	f
172	R23/8361	K M L CHATURVEDI	XXXX-XX-5594	\N	3	\N	27	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.35209	2026-07-03 21:19:24.35209	t	2021-08-19	f	\N	R23/8361	R P CHATURVEDI	27	B-2	3/NA	2021-08-19	f
173	R23/8379	GAURAV SETHI	XXXX-XX-7962	\N	3	\N	28	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.354297	2026-07-03 21:19:24.354297	t	2022-11-11	f	\N	R23/8379	JAGDISH SETHI	28	B-2	3/NA	2022-11-11	f
174	R23/5478	PRANJAL AGARWAL	\N	\N	3	\N	29	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.356737	2026-07-03 21:19:24.356737	t	2024-10-15	f	\N	R23/5478	SHIV KUMAR AGARWAL	\N	B-2	3/N.A.	2024-10-15	f
175	R23/8364	SAURABH CHAUHAN	XXXX-XX-6370	\N	3	\N	30	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.359946	2026-07-03 21:19:24.359946	t	2019-02-12	f	\N	R23/8364	RISAL SINGH CHAUHAN	30	B-2	3/NA	2019-02-12	f
176	R23/8365	AJAY CHAUHAN	\N	\N	3	\N	31	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.362733	2026-07-03 21:19:24.362733	t	2019-02-12	f	\N	R23/8365	SUBASH GANGWAR	31	B-2	3/NA	2019-02-12	f
177	R23/8366	YOGESH KUMAR SAXENA	XXXX-XX-8864	\N	3	\N	32	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.365288	2026-07-03 21:19:24.365288	t	2020-10-05	f	\N	R23/8366	SHIR RAM PRATAP SAXENA	32	B-2	3/NA	2020-10-05	f
178	R23/5176	SUMIT KUMAR	\N	\N	3	\N	33	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.367971	2026-07-03 21:19:24.367971	f	\N	f	\N	R23/5176	SHIV KUMAR AGARWAL	33	B-2	3/NA	\N	f
179	R23/8368	NALIN CHANDRA TRIPATHI	XXXX-XX-7136	\N	3	\N	34	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.370983	2026-07-03 21:19:24.370983	t	2021-06-15	f	\N	R23/8368	\N	34	B-2	3/NA	2021-06-15	f
180	R23/8369	GEETA SRIVASTAVA	XXXX-XX-2510	\N	3	\N	35	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.37366	2026-07-03 21:19:24.37366	t	2018-12-06	f	\N	R23/8369	SHAILENDRA KR SRIVASTAVA	\N	B-2	3/NA	2018-12-06	f
181	R23/8370	KRISHNA GOPAL BEHL	XXXX-XX-5421	\N	3	\N	36	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.376245	2026-07-03 21:19:24.376245	t	2022-08-23	f	\N	R23/8370	BENARSI DAS BEHL	36	B-2	3/NA	2022-08-23	f
182	R23/8372	ASHOO KIRANI	XXXX-XX-0931	\N	3	\N	37	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.378859	2026-07-03 21:19:24.378859	t	2018-10-30	f	\N	R23/8372	\N	37	B-2	3/NA	2018-10-30	f
183	R23/8945	BHARTI DUGRA	XXXX-XX-0516	\N	3	\N	38	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.38256	2026-07-03 21:19:24.38256	t	2024-09-21	f	\N	R23/8945	PAWAN THAKUR	\N	B-2	3/NA	2024-09-21	f
184	R23/3215	SAROOJ KUMARI	XXXX-XX-4268	\N	3	\N	39	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.3853	2026-07-03 21:19:24.3853	t	2023-09-29	f	\N	R23/3215	\N	39	B-2	3/NA	2023-09-29	f
185	R23/8373	PRAMENDRA KUMAR	XXXX-XX-2921	\N	3	\N	40	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.387874	2026-07-03 21:19:24.387874	t	2018-10-12	f	\N	R23/8373	UDAY VEER SINGH	40	B-2	3/NA	2018-10-12	f
186	R23/8236	RAJNEET KAUR	XXXX-XX-7979	\N	3	\N	41	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.390458	2026-07-03 21:19:24.390458	t	2023-05-25	f	\N	R23/8236	\N	41	B-2	3/NA	2023-05-25	f
187	R23/8316	SACHIN AGARWAL	\N	\N	3	\N	42	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.393505	2026-07-03 21:19:24.393505	t	2018-03-26	f	\N	R23/8316	PREM AGARWAL	42	B-2	3/NA	2018-03-26	f
188	R23/8317	SHALINI AGARWAL	XXXX-XX-2682	\N	3	\N	43	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.396231	2026-07-03 21:19:24.396231	t	2014-08-22	f	\N	R23/8317	HARI KRISHNA KARYALYA	43	B-2	3/NA	2014-08-22	f
189	R23/8318	MAHESH KUMAR	XXXX-XX-4980	\N	3	\N	44	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.398768	2026-07-03 21:19:24.398768	t	2019-11-23	f	\N	R23/8318	DORI LAL	44	B-2	3/NA	2019-11-23	f
190	R23/6786	NAVNEET GARG	XXXX-XX-3887	\N	3	\N	45	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.401474	2026-07-03 21:19:24.401474	f	\N	f	\N	R23/6786	SURESH CHAND GARG	\N	B-2	3/NA	\N	f
191	R23/8319	PRATIMA TIWARI	XXXX-XX-8443	\N	3	\N	46	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.404483	2026-07-03 21:19:24.404483	t	2020-11-18	f	\N	R23/8319	NAMIT TIWARI	46	B-2	3/NA	2020-11-18	f
192	R23/8380	SATYAMVADA	XXXX-XX-7965	\N	3	\N	47	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.407179	2026-07-03 21:19:24.407179	t	2022-04-08	f	\N	R23/8380	ANUJ SHARMA	\N	B-2	3/NA	2022-04-08	f
193	R23/8320	AYUSH SINGH	XXXX-XX-0860	\N	3	\N	48	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.410009	2026-07-03 21:19:24.410009	t	2021-08-12	f	\N	R23/8320	M S NEGI	48	B-2	3/NA	2021-08-12	f
194	R23/6761	VINOD KUMAR TOMAR	XXXX-XX-3145	\N	3	\N	50	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.412837	2026-07-03 21:19:24.412837	f	\N	f	\N	R23/6761	RAMPAL SINGH TOMAR	\N	B-2	3/NA	\N	f
195	R23/8321	MAYA DEVI	XXXX-XX-3177	\N	3	\N	51	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.415842	2026-07-03 21:19:24.415842	t	2021-09-07	f	\N	R23/8321	ASHOK KUMAR	\N	B-2	3/NA	2021-09-07	f
196	R23/8322	SURENDRA GUPTA	\N	\N	3	\N	52	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.418602	2026-07-03 21:19:24.418602	t	2020-10-29	f	\N	R23/8322	NARENDRA MOHAN GUPTA	52	B-2	3/NA	2020-10-29	f
197	R23/8920	RAM KANWAR	\N	\N	3	\N	53	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.421365	2026-07-03 21:19:24.421365	t	2024-06-27	f	\N	R23/8920	BHURE SINGH	\N	B-2	3/NA	2024-06-27	f
198	R23/8323	OM PRAKASH	\N	\N	3	\N	54	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.423937	2026-07-03 21:19:24.423937	t	2018-07-05	f	\N	R23/8323	KHACHER MAL	54	B-2	3/NA	2018-07-05	f
199	R23/8324	GOPAL PANDEY	\N	\N	3	\N	55	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.427611	2026-07-03 21:19:24.427611	t	2022-09-29	f	\N	R23/8324	R D PANDEY	55	B-2	3/NA	2022-09-29	f
200	R23/10695	SUKH PAL SINGH	\N	\N	3	\N	56	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.429991	2026-07-03 21:19:24.429991	f	\N	f	\N	R23/10695	ATTAR SINGH	\N	B-2	3/NA	\N	f
201	R23/8929	SHRI BALAJI TRADERS PARTNER HARISH KUMAR GUPTA, OM PRAKASH GUPTA	XXXX-XX-1000	\N	3	\N	57	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.432632	2026-07-03 21:19:24.432632	t	2022-07-23	f	\N	R23/8929	MOOL CHND AGARWAL	\N	B-2	3/NA	2022-07-23	f
202	R23/8325	AMIT KUMAR SINGH	XXXX-XX-7084	\N	3	\N	58	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.435363	2026-07-03 21:19:24.435363	t	2018-12-10	f	\N	R23/8325	PREM VEER SINGH	58	B-2	3/NA	2018-12-10	f
203	R23/8919	VIJAY KUMAR	XXXX-XX-3670	\N	3	\N	59	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.438551	2026-07-03 21:19:24.438551	t	2024-06-24	f	\N	R23/8919	THIRATH DASS	\N	B-2	3/NA	2024-06-24	f
204	R23/6204	SAPNA MISRA	\N	\N	3	\N	60	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.441215	2026-07-03 21:19:24.441215	f	\N	f	\N	R23/6204	\N	\N	B-2	3/NA	\N	f
205	R23/8326	SUNDEEP KUMAR	XXXX-XX-6770	\N	3	\N	61	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.443596	2026-07-03 21:19:24.443596	t	2021-12-24	f	\N	R23/8326	KRISHAN LAL	61	B-2	3/NA	2021-12-24	f
206	R23/8327	SHASHI GUPTA	XXXX-XX-3355	\N	3	\N	62	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.446781	2026-07-03 21:19:24.446781	t	2022-10-01	f	\N	R23/8327	\N	\N	B-2	3/NA	2022-10-01	f
207	R23/3146	MEENA	\N	\N	3	\N	63	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.450061	2026-07-03 21:19:24.450061	t	2024-01-29	f	\N	R23/3146	AJAY KUAMR	63	B-2	3/NA	2024-01-29	f
208	R23/2922	MANPREET KAUR NANDA	XXXX-XX-4640	\N	3	\N	64	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.452551	2026-07-03 21:19:24.452551	f	\N	f	\N	R23/2922	\N	64	B-2	3/NA	\N	f
209	R23/10678	Vacant	\N	\N	3	\N	65	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.454911	2026-07-03 21:19:24.454911	f	\N	f	\N	R23/10678	\N	65	B-2	3/NA	\N	f
210	R23/2928	BIRENDRA PRASAD DIXIT	XXXX-XX-5708	\N	3	\N	66	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.457423	2026-07-03 21:19:24.457423	t	2025-03-07	f	\N	R23/2928	\N	66	B-2	3/NA	2025-03-07	f
211	R23/8949	MUDIT AGARWAL	\N	\N	3	\N	67	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.460499	2026-07-03 21:19:24.460499	t	2025-03-20	f	\N	R23/8949	D K GUPTA	\N	B-2	3/NA	2025-03-20	f
212	R23/2932	VIBHA SINGH	XXXX-XX-3332	\N	3	\N	68	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.463303	2026-07-03 21:19:24.463303	f	\N	f	\N	R23/2932	\N	68	B-2	3/NA	\N	f
213	R23/2935	NISHA SHARMA	XXXX-XX-8167	\N	3	\N	69	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.466028	2026-07-03 21:19:24.466028	t	2025-06-13	f	\N	R23/2935	\N	69	B-2	3/NA	2025-06-13	f
214	R23/3168	RENU	XXXX-XX-8376	\N	3	\N	7	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.469155	2026-07-03 21:19:24.469155	f	\N	f	\N	R23/3168	-	-	B-2	3/NA	\N	f
215	R23/4150	RENU	XXXX-XX-8376	\N	3	\N	7	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.472642	2026-07-03 21:19:24.472642	f	\N	f	\N	R23/4150	PADAM SINGH	7	B-2	3/N.A.	\N	f
216	R23/6975	KRISHNA GOPAL SAXENA	\N	\N	3	\N	70	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.475526	2026-07-03 21:19:24.475526	t	2025-02-13	f	\N	R23/6975	P S SAXENA	\N	B-2	3/NA	2025-02-13	f
217	R23/4299	AVISHKA AGARWAL	XXXX-XX-5273	\N	3	\N	71	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.478085	2026-07-03 21:19:24.478085	f	\N	f	\N	R23/4299	RAMAN KUMAR AGARWAL	71	B-2	3/NA	\N	f
218	R23/6984	BINITA SAXENA	XXXX-XX-8404	\N	3	\N	72	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.480683	2026-07-03 21:19:24.480683	t	2025-06-13	f	\N	R23/6984	\N	\N	B-2	3/NA	2025-06-13	f
219	R23/2939	SANDEEP SHARMA	XXXX-XX-3639	\N	3	\N	73	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.484256	2026-07-03 21:19:24.484256	t	2025-01-30	f	\N	R23/2939	\N	73	B-2	3/NA	2025-01-30	f
220	R23/4301	PUSHPA GUPTA	XXXX-XX-0288	\N	3	\N	74	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.486723	2026-07-03 21:19:24.486723	f	\N	f	\N	R23/4301	\N	74	B-2	3/NA	\N	f
221	R23/4006	RAMESH CHANDRA SAXENA	XXXX-XX-1710	\N	3	\N	75	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.489421	2026-07-03 21:19:24.489421	t	2024-11-13	f	\N	R23/4006	HIRA LAL SAXENA	75	B-2	3/NA	2024-11-13	f
222	R23/8381	ALKA RANI YADAV	\N	\N	3	\N	76	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.492105	2026-07-03 21:19:24.492105	t	2023-12-02	f	\N	R23/8381	CHANDRA PRAKASH YADAV	76	B-2	3/NA	2023-12-02	f
223	R23/8382	SITA RAM	\N	\N	3	\N	77	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.49508	2026-07-03 21:19:24.49508	t	2023-12-19	f	\N	R23/8382	JUKHI RAM	77	B-2	3/NA	2023-12-19	f
225	R23/3191	AWADH KUMAR AGARWAL	XXXX-XX-8147	\N	3	\N	79	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.500114	2026-07-03 21:19:24.500114	t	2024-03-07	f	\N	R23/3191	KRISHNA AUTAR AGARWAL	79	B-2	3/NA	2024-03-07	f
226	R23/3158	SHOBHA GUPTA	XXXX-XX-1113	\N	3	\N	80	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.503101	2026-07-03 21:19:24.503101	t	2024-01-20	f	\N	R23/3158	-	80	B-2	3/NA	2024-01-20	f
227	R23/8234	POONAM GUPTA	XXXX-XX-7313	\N	3	\N	81	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.506371	2026-07-03 21:19:24.506371	t	2022-12-03	f	\N	R23/8234	\N	81	B-2	3/NA	2022-12-03	f
228	R23/6760	RAJENDRA SINGH	XXXX-XX-5700	\N	3	\N	82	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.508919	2026-07-03 21:19:24.508919	t	2024-08-31	f	\N	R23/6760	GAJ RAM SINGH	\N	B-2	3/NA	2024-08-31	f
229	R23/8237	VIKAS GABA	XXXX-XX-6479	\N	3	\N	83	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.512157	2026-07-03 21:19:24.512157	t	2023-02-01	f	\N	R23/8237	\N	83	B-2	3/NA	2023-02-01	f
230	R23/6758	SATENDRA KUMAR DR	XXXX-XX-4752	\N	3	\N	84	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.515131	2026-07-03 21:19:24.515131	t	2024-10-29	f	\N	R23/6758	GANGA PRASAD	\N	B-2	3/NA	2024-10-29	f
231	R23/8328	AJAY KUMAR AGNIHOTRI	XXXX-XX-3500	\N	3	\N	85	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.518351	2026-07-03 21:19:24.518351	t	2022-03-29	f	\N	R23/8328	OM PRAKSH SHARMA	85	B-2	3/NA	2022-03-29	f
232	R23/8930	AKANSHA SHUKLA	\N	\N	3	\N	86	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.52097	2026-07-03 21:19:24.52097	t	2022-10-01	f	\N	R23/8930	NIMESH SHUKLA	\N	B-2	3/NA	2022-10-01	f
233	R23/8329	SHIVANI PATHAK	XXXX-XX-0333	\N	3	\N	87	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.523588	2026-07-03 21:19:24.523588	t	2019-02-13	f	\N	R23/8329	PRAMOD KUMAR PATHAK	87	B-2	3/NA	2019-02-13	f
234	R23/8330	GHANENDRA SINGH	\N	\N	3	\N	88	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.526193	2026-07-03 21:19:24.526193	t	2022-01-15	f	\N	R23/8330	MOHAN LAL	88	B-2	3/NA	2022-01-15	f
235	R23/8928	SEEMA AGARWAL	XXXX-XX-2088	\N	3	\N	89	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.52927	2026-07-03 21:19:24.52927	t	2022-07-23	f	\N	R23/8928	\N	\N	B-2	3/NA	2022-07-23	f
236	R23/4123	HORESH KUMAR	XXXX-XX-8410	\N	3	\N	90	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.531916	2026-07-03 21:19:24.531916	t	2024-01-02	f	\N	R23/4123	BRIJ KISHORE	90	B-2	3/NA	2024-01-02	f
237	R23/8383	HAR PREET SINGH	\N	\N	3	\N	91	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.534588	2026-07-03 21:19:24.534588	t	2023-07-26	f	\N	R23/8383	GURCHARAN SINGH	91	B-2	3/NA	2023-07-26	f
238	R23/8233	ASHUTOSH AGARWAL	XXXX-XX-5885	\N	3	\N	92	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.537421	2026-07-03 21:19:24.537421	t	2022-12-03	f	\N	R23/8233	\N	92	B-2	3/NA	2022-12-03	f
239	R23/6754	AKHIL CHANDRA	XXXX-XX-9147	\N	3	\N	93	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.540325	2026-07-03 21:19:24.540325	f	\N	f	\N	R23/6754	HARISH CHANDRA	\N	B-2	3/NA	\N	f
240	R23/8331	JITENDU NARAYAN ROY	XXXX-XX-9370	\N	3	\N	94	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.54316	2026-07-03 21:19:24.54316	t	2021-07-07	f	\N	R23/8331	ARDHENDU NARAYAN ROY	94	B-2	3/NA	2021-07-07	f
241	R23/8332	RAJESH KUMAR RASTOGI	XXXX-XX-3931	\N	3	\N	95	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.545814	2026-07-03 21:19:24.545814	t	2017-06-07	f	\N	R23/8332	SURESH CHANDRA RASTOGI	95	B-2	3/NA	2017-06-07	f
242	R23/6764	RENU GARG	XXXX-XX-6669	\N	3	\N	96	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.548396	2026-07-03 21:19:24.548396	t	2025-03-29	f	\N	R23/6764	\N	\N	B-2	3/NA	2025-03-29	f
243	R23/8333	NEHA KHATWANI	XXXX-XX-3033	\N	3	\N	97	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.551414	2026-07-03 21:19:24.551414	t	2022-09-29	f	\N	R23/8333	\N	97	B-2	3/NA	2022-09-29	f
244	R23/6628	ANIL KUMAR GANGWAR, KHANGEMBAM SANGEETA DEVI	XXXX-XX-3362	\N	3	\N	98	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.554579	2026-07-03 21:19:24.554579	t	2024-08-31	f	\N	R23/6628	RAVI DATT SHARMA	\N	B-2	3/NA	2024-08-31	f
245	R23/4031	GINNI AGARWAL,VANSHU GOEL	XXXX-XX-3635	\N	3	\N	99	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.557141	2026-07-03 21:19:24.557141	t	2025-03-07	f	\N	R23/4031	\N	99	B-2	3/NA	2025-03-07	f
246	R23/11491	VIKRAM GUPTA (RESCHEDULED)	XXXX-XX-7315	\N	3	\N	R 134	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.560001	2026-07-03 21:19:24.560001	f	\N	f	\N	R23/11491	ARVIND GUPTA	\N	B-2	3/NA	\N	f
247	R23/8149	RAMNRAIN GUPTA	XXXX-XX-6312	\N	3	\N	04	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.563197	2026-07-03 21:19:24.563197	t	2019-01-24	f	\N	R23/8149	BIPAT GUPTA	\N	B-3	3/NA	2019-01-24	f
248	R23/8150	NISHA GANGWAR	\N	\N	3	\N	05	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.565907	2026-07-03 21:19:24.565907	t	2021-01-07	f	\N	R23/8150	RAKESH PAL SINGH	\N	B-3	3/NA	2021-01-07	f
249	R23/8151	SUDARSHAN PARMAR	XXXX-XX-0715	\N	3	\N	06	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.568598	2026-07-03 21:19:24.568598	t	2021-03-10	f	\N	R23/8151	\N	\N	B-3	3/NA	2021-03-10	f
250	R23/8152	REKHA RANI SAXENA	\N	\N	3	\N	07	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.571158	2026-07-03 21:19:24.571158	t	2022-04-26	f	\N	R23/8152	\N	\N	B-3	3/NA	2022-04-26	f
251	R23/8153	VIPUL KUMAR TIWARI	XXXX-XX-2645	\N	3	\N	08	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.574418	2026-07-03 21:19:24.574418	t	2021-07-20	f	\N	R23/8153	VINOD KUMAR TIWARI	\N	B-3	3/NA	2021-07-20	f
252	R23/8154	RANJANA JOHRI	\N	\N	3	\N	09	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.577027	2026-07-03 21:19:24.577027	t	2022-04-25	f	\N	R23/8154	RAKESH JOHRI	\N	B-3	3/NA	2022-04-25	f
253	R23/8239	AMITA MISRA	XXXX-XX-6213	\N	3	\N	1	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.57974	2026-07-03 21:19:24.57974	t	2023-02-07	f	\N	R23/8239	NIRAJ MISHRA	1	B-3	3/NA	2023-02-07	f
254	R23/8155	WASIM AKHTAR	XXXX-XX-1099	\N	3	\N	10	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.582388	2026-07-03 21:19:24.582388	t	2021-08-12	f	\N	R23/8155	KHATIB AHMAD	\N	B-3	3/NA	2021-08-12	f
255	R23/5030	DHARMPAL RATHOR	\N	\N	3	\N	11	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.58545	2026-07-03 21:19:24.58545	t	2024-05-16	f	\N	R23/5030	R S RATHORE	11	B-3	3/NA	2024-05-16	f
256	R23/6444	RAKESH	XXXX-XX-6803	\N	3	\N	11A	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.588017	2026-07-03 21:19:24.588017	t	2024-10-04	f	\N	R23/6444	RAMYASH	\N	B-3	3/NA	2024-10-04	f
257	R23/8157	SUSHMA SINGH	XXXX-XX-6787	\N	3	\N	12	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.590481	2026-07-03 21:19:24.590481	t	2021-08-25	f	\N	R23/8157	\N	\N	B-3	3/NA	2021-08-25	f
258	R23/8156	SHAKUNTALA SRIVASTAVA	\N	\N	3	\N	13	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.593174	2026-07-03 21:19:24.593174	t	2019-12-27	f	\N	R23/8156	K N SRIVASTAVA	\N	B-3	3/NA	2019-12-27	f
259	R23/8980	MANJULA GUPTA	\N	\N	3	\N	14	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.596353	2026-07-03 21:19:24.596353	t	2023-10-27	f	\N	R23/8980	SANDEEP GUPTA	\N	B-3	3/NA	2023-10-27	f
261	R23/6445	RITU BHUTANI TIWAR	XXXX-XX-0884	\N	3	\N	15	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.602174	2026-07-03 21:19:24.602174	f	\N	f	\N	R23/6445	\N	\N	B-3	3/NA	\N	f
262	R23/8158	MREENAL KANT HALDAR	XXXX-XX-5645	\N	3	\N	16	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.605132	2026-07-03 21:19:24.605132	t	2021-11-23	f	\N	R23/8158	SHEKHAR C HALDAR	\N	B-3	3/NA	2021-11-23	f
263	R23/8232	ANURAG KUMAR AGARWAL	\N	\N	3	\N	17	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.608044	2026-07-03 21:19:24.608044	t	2022-10-21	f	\N	R23/8232	BMS AGARWAL	17	B-3	3/NA	2022-10-21	f
264	R23/8230	SUSHMA PANDEY	XXXX-XX-4670	\N	3	\N	18	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.610654	2026-07-03 21:19:24.610654	t	2022-10-21	f	\N	R23/8230	SHAYAM CHAND PANDEY	18	B-3	3/NA	2022-10-21	f
265	R23/6446	POONAM GAUTAM	XXXX-XX-0313	\N	3	\N	19	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.61311	2026-07-03 21:19:24.61311	f	\N	f	\N	R23/6446	\N	\N	B-3	3/NA	\N	f
266	R23/8238	GOPAL KRISHNA TRIVEDI	\N	\N	3	\N	2	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.615304	2026-07-03 21:19:24.615304	t	2023-02-07	f	\N	R23/8238	RAMCHNDRA TRIVEDI	2	B-3	3/NA	2023-02-07	f
267	R23/8159	SHIVA LAKHAN SINGH	XXXX-XX-7790	\N	3	\N	20	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.618146	2026-07-03 21:19:24.618146	t	2021-02-09	f	\N	R23/8159	\N	\N	B-3	3/NA	2021-02-09	f
268	R23/8160	JAGDISH CHANDRA GAIN	XXXX-XX-8442	\N	3	\N	21	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.620967	2026-07-03 21:19:24.620967	t	2021-11-23	f	\N	R23/8160	JATIN GAIN	\N	B-3	3/NA	2021-11-23	f
269	R23/6447	LEELA	XXXX-XX-5008	\N	3	\N	22	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.623402	2026-07-03 21:19:24.623402	f	\N	f	\N	R23/6447	\N	\N	B-3	3/NA	\N	f
260	R23/10680	Vacant	\N	\N	3	\N	142	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.599507	2026-07-03 21:19:24.599507	f	\N	f	\N	R23/10680	\N	142	B-3	3/NA	\N	f
270	R23/8161	ANITA SAXENA	XXXX-XX-3672	\N	3	\N	23	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.625972	2026-07-03 21:19:24.625972	t	2021-08-25	f	\N	R23/8161	SHAMBHU ANAND	\N	B-3	3/NA	2021-08-25	f
271	R23/6448	SATISH CHANDRA SAGAR	XXXX-XX-8766	\N	3	\N	23A	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.629062	2026-07-03 21:19:24.629062	f	\N	f	\N	R23/6448	JOGRAJ SAGAR	\N	B-3	3/NA	\N	f
272	R23/8162	RENU SAXENA	XXXX-XX-0215	\N	3	\N	24	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.631757	2026-07-03 21:19:24.631757	t	2018-05-01	f	\N	R23/8162	\N	\N	B-3	3/NA	2018-05-01	f
273	R23/8982	ASHUTOSH KUMAR ARYA	XXXX-XX-3890	\N	3	\N	25	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.634138	2026-07-03 21:19:24.634138	t	2023-10-27	f	\N	R23/8982	NARESH KUMAR ARYA	\N	B-3	3/NA	2023-10-27	f
274	R23/8163	VIRENDRA	XXXX-XX-1306	\N	3	\N	26	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.636602	2026-07-03 21:19:24.636602	t	2020-09-02	f	\N	R23/8163	RAM SINGH	\N	B-3	3/NA	2020-09-02	f
275	R23/8164	DEEKSHA CHAUDHARY	\N	\N	3	\N	27	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.64019	2026-07-03 21:19:24.64019	t	2022-10-18	f	\N	R23/8164	ABHISHEK CHAUDHARY	\N	B-3	3/NA	2022-10-18	f
276	R23/8165	ASHISH GANGWAR	XXXX-XX-9647	\N	3	\N	28	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.642919	2026-07-03 21:19:24.642919	t	2021-07-07	f	\N	R23/8165	NATTHU LAL GANGWAR	\N	B-3	3/NA	2021-07-07	f
277	R23/5155	MUGISH	\N	\N	3	\N	29	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.645541	2026-07-03 21:19:24.645541	f	\N	f	\N	R23/5155	\N	29	B-3	3/NA	\N	f
278	R23/6443	SUNIL KUMAR RATHORE	XXXX-XX-9622	\N	3	\N	3	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.648455	2026-07-03 21:19:24.648455	t	2024-11-29	f	\N	R23/6443	RAM SANENI RATHORE	\N	B-3	3/NA	2024-11-29	f
279	R23/8166	USHA GANGWAR	XXXX-XX-1304	\N	3	\N	30	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.651824	2026-07-03 21:19:24.651824	t	2020-11-20	f	\N	R23/8166	\N	\N	B-3	3/NA	2020-11-20	f
280	R23/8983	MAHILAL	XXXX-XX-8176	\N	3	\N	31	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.654535	2026-07-03 21:19:24.654535	t	2023-05-06	f	\N	R23/8983	KALYAN DATT	\N	B-3	3/NA	2023-05-06	f
281	R23/8984	MOHD GAYAZ	XXXX-XX-3017	\N	3	\N	32	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.657138	2026-07-03 21:19:24.657138	t	2021-01-30	f	\N	R23/8984	MUKHTAR AHMAD	\N	B-3	3/NA	2021-01-30	f
282	R23/8167	PREMPAL MOURYA	XXXX-XX-9444	\N	3	\N	33	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.659709	2026-07-03 21:19:24.659709	t	2021-02-17	f	\N	R23/8167	BABURAM MOURYA	\N	B-3	3/NA	2021-02-17	f
283	R23/6449	ANITA SINGH	XXXX-XX-6373	\N	3	\N	34	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.662713	2026-07-03 21:19:24.662713	t	2025-03-07	f	\N	R23/6449	\N	\N	B-3	3/NA	2025-03-07	f
284	R23/8168	VINOD SAXENA	\N	\N	3	\N	35	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.665412	2026-07-03 21:19:24.665412	t	2021-04-13	f	\N	R23/8168	SURESH CHANDRA SAXENA	\N	B-3	3/NA	2021-04-13	f
285	R23/8169	NITA YADAV	XXXX-XX-0221	\N	3	\N	36	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.668167	2026-07-03 21:19:24.668167	t	2022-09-26	f	\N	R23/8169	SHUSHUPAL SINGH	\N	B-3	3/NA	2022-09-26	f
286	R23/8170	AJAY KUMAR	XXXX-XX-1312	\N	3	\N	37	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.670875	2026-07-03 21:19:24.670875	t	2021-08-12	f	\N	R23/8170	DRAGPAL	\N	B-3	3/NA	2021-08-12	f
287	R23/3160	SHOBHIT SAXENA	XXXX-XX-0146	\N	3	\N	38	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.674071	2026-07-03 21:19:24.674071	t	2023-10-21	f	\N	R23/3160	ASHOK KUMAR SAXENA	38	B-3	3/NA	2023-10-21	f
288	R23/3253	GAURAV SINGH	XXXX-XX-4420	\N	3	\N	39	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.676853	2026-07-03 21:19:24.676853	t	2023-11-08	f	\N	R23/3253	DHARMENDRA SINGH	39	B-3	3/NA	2023-11-08	f
289	R23/8171	RAJNISH KUMAR BHARTI	XXXX-XX-8904	\N	3	\N	40	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.679589	2026-07-03 21:19:24.679589	t	2021-10-12	f	\N	R23/8171	TOTA RAM	\N	B-3	3/NA	2021-10-12	f
290	R23/8172	NARGIS	XXXX-XX-4997	\N	3	\N	41	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.682925	2026-07-03 21:19:24.682925	t	2021-07-13	f	\N	R23/8172	\N	\N	B-3	3/NA	2021-07-13	f
291	R23/9451	ANUPAM GUPTA	XXXX-XX-9000	\N	3	\N	42	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.686133	2026-07-03 21:19:24.686133	t	2022-05-18	f	\N	R23/9451	AMIT GUPTA	\N	B-3	3/NA	2022-05-18	f
292	R23/8986	RAJEEV KUMAR SRIVASTAVA	XXXX-XX-1260	\N	3	\N	43	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.688855	2026-07-03 21:19:24.688855	t	2022-06-04	f	\N	R23/8986	SITARAM PRASAD SHRIVASTAV	\N	B-3	3/NA	2022-06-04	f
293	R23/4122	DHARMENDRA KUMAR	XXXX-XX-5590	\N	3	\N	44	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.692051	2026-07-03 21:19:24.692051	t	2024-02-14	f	\N	R23/4122	GOPI CHAND	44	B-3	3/NA	2024-02-14	f
294	R23/6450	RAGHAV AGARWAL	XXXX-XX-9158	\N	3	\N	45	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.69478	2026-07-03 21:19:24.69478	f	\N	f	\N	R23/6450	ALOK KUMAR AGARWAL	\N	B-3	3/NA	\N	f
295	R23/8987	BRAJ KISHOR	XXXX-XX-5100	\N	3	\N	46	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.69778	2026-07-03 21:19:24.69778	t	2021-09-04	f	\N	R23/8987	SIYARAM	\N	B-3	3/NA	2021-09-04	f
296	R23/8988	NITIN JAISWAL	XXXX-XX-5050	\N	3	\N	47	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.700435	2026-07-03 21:19:24.700435	t	2021-11-23	f	\N	R23/8988	SUNILJAISWAL	\N	B-3	3/NA	2021-11-23	f
297	R23/10675	Vacant	\N	\N	3	\N	48	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.703122	2026-07-03 21:19:24.703122	f	\N	f	\N	R23/10675	\N	48	B-3	3/NA	\N	f
298	R23/8991	SANJEEV KUMAR	XXXX-XX-0600	\N	3	\N	49	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.705791	2026-07-03 21:19:24.705791	t	2022-07-23	f	\N	R23/8991	RAGHUNATH SARAN	\N	B-3	3/NA	2022-07-23	f
299	R23/8993	MANJU KUMRI	XXXX-XX-4344	\N	3	\N	50	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.708888	2026-07-03 21:19:24.708888	t	2022-10-21	f	\N	R23/8993	AVNISH KUMAR KANOJIYA	\N	B-3	3/NA	2022-10-21	f
300	R23/5059	SHAILLY KHANDELWAL, AMIT KHANDELWAL	XXXX-XX-6666	\N	3	\N	51	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.711419	2026-07-03 21:19:24.711419	t	2024-05-21	f	\N	R23/5059	AVINNASHI LAL AGARWAL	51	B-3	3/NA	2024-05-21	f
301	R23/6451	RAJAT SHARMA	XXXX-XX-1666	\N	3	\N	52	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.713987	2026-07-03 21:19:24.713987	f	\N	f	\N	R23/6451	SURENDRA KUMAR SHARMA	\N	B-3	3/NA	\N	f
302	R23/8995	BHAWNA MISHRA	XXXX-XX-5836	\N	3	\N	53	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.716299	2026-07-03 21:19:24.716299	t	2022-10-31	f	\N	R23/8995	VIJAY MISHRA	\N	B-3	3/NA	2022-10-31	f
303	R23/4136	JEEVA LAL	XXXX-XX-5657	\N	3	\N	54	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.719444	2026-07-03 21:19:24.719444	t	2024-03-02	f	\N	R23/4136	SHRI HEERA LAL	54	B-3	3/NA	2024-03-02	f
304	R23/6452	ANSU LATA SINGH	XXXX-XX-0324	\N	3	\N	55	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.722215	2026-07-03 21:19:24.722215	t	2025-02-13	f	\N	R23/6452	\N	\N	B-3	3/NA	2025-02-13	f
305	R23/6453	ARNAVI SAGAR	XXXX-XX-1627	\N	3	\N	56	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.725265	2026-07-03 21:19:24.725265	f	\N	f	\N	R23/6453	\N	\N	B-3	3/NA	\N	f
306	R23/6455	VIVEK VERMA	XXXX-XX-5060	\N	3	\N	57	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.727786	2026-07-03 21:19:24.727786	f	\N	f	\N	R23/6455	BHARAT PRASAD VERMA	\N	B-3	3/NA	\N	f
307	R23/6459	POONAM SAHU	XXXX-XX-4933	\N	3	\N	58	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.730859	2026-07-03 21:19:24.730859	t	2025-03-29	f	\N	R23/6459	\N	\N	B-3	3/NA	2025-03-29	f
308	R23/6456	ATUL KUMAR SAXENA	XXXX-XX-4793	\N	3	\N	59	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.733561	2026-07-03 21:19:24.733561	t	2025-03-07	f	\N	R23/6456	NARENDRA MOHAN SAXENA	\N	B-3	3/NA	2025-03-07	f
309	R23/6465	MANJEET SINGH	XXXX-XX-3016	\N	3	\N	60	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.736057	2026-07-03 21:19:24.736057	f	\N	f	\N	R23/6465	JAGDISH PRASAD	\N	B-3	3/NA	\N	f
310	R23/10677	Vacant	\N	\N	3	\N	62	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.738424	2026-07-03 21:19:24.738424	f	\N	f	\N	R23/10677	\N	62	B-3	3/NA	\N	f
311	R23/4340	BAL KISHAN	XXXX-XX-8617	\N	3	\N	63	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.741618	2026-07-03 21:19:24.741618	t	2024-03-02	f	\N	R23/4340	SIYA RAM	63	B-3	3/NA	2024-03-02	f
312	R23/2851	BHANU PRATAP SINGH	XXXX-XX-0409	\N	3	\N	64	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.744306	2026-07-03 21:19:24.744306	t	2025-06-06	f	\N	R23/2851	\N	64	B-3	3/NA	2025-06-06	f
313	R23/2858	SHIKHA SHARMA	XXXX-XX-6476	\N	3	\N	65	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.746829	2026-07-03 21:19:24.746829	t	2024-02-24	f	\N	R23/2858	\N	65	B-3	3/NA	2024-02-24	f
314	R23/2871	PREM SINGH	XXXX-XX-6282	\N	3	\N	66	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.749331	2026-07-03 21:19:24.749331	t	2024-03-02	f	\N	R23/2871	\N	66	B-3	3/NA	2024-03-02	f
315	R23/2872	SUBHI SHARMA	XXXX-XX-7744	\N	3	\N	67	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.752427	2026-07-03 21:19:24.752427	f	\N	f	\N	R23/2872	\N	67	B-3	3/NA	\N	f
316	R23/2875	SANJEEV KUMAR SINGH	XXXX-XX-6098	\N	3	\N	68	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.755035	2026-07-03 21:19:24.755035	f	\N	f	\N	R23/2875	\N	68	B-3	3/NA	\N	f
317	R23/2879	NIDHI	XXXX-XX-3346	\N	3	\N	69	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.757854	2026-07-03 21:19:24.757854	f	\N	f	\N	R23/2879	\N	69	B-3	3/NA	\N	f
318	R23/2883	VIPIN DEVAL	XXXX-XX-4230	\N	3	\N	70	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.760632	2026-07-03 21:19:24.760632	f	\N	f	\N	R23/2883	\N	70	B-3	3/NA	\N	f
319	R23/2885	JAGPREET SINGH	XXXX-XX-3111	\N	3	\N	71	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.763838	2026-07-03 21:19:24.763838	f	\N	f	\N	R23/2885	\N	71	B-3	3/NA	\N	f
320	R23/2888	TRIPTI RATHORE	XXXX-XX-2356	\N	3	\N	72	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.766984	2026-07-03 21:19:24.766984	f	\N	f	\N	R23/2888	\N	72	B-3	3/NA	\N	f
321	R23/2892	BRAJESH KUMAR YADAV	XXXX-XX-9643	\N	3	\N	73	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.769677	2026-07-03 21:19:24.769677	f	\N	f	\N	R23/2892	\N	73	B-3	3/NA	\N	f
322	R23/2894	KULDEEP KUMAR GAUTAM	XXXX-XX-4783	\N	3	\N	74	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.772902	2026-07-03 21:19:24.772902	t	2024-12-12	f	\N	R23/2894	\N	74	B-3	3/NA	2024-12-12	f
323	R23/2895	GAURAV KUMAR	XXXX-XX-6177	\N	3	\N	75	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.777072	2026-07-03 21:19:24.777072	f	\N	f	\N	R23/2895	\N	75	B-3	3/NA	\N	f
324	R23/2897	DEVENDRA PRATAP SINGH	XXXX-XX-9067	\N	3	\N	76	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.779791	2026-07-03 21:19:24.779791	f	\N	f	\N	R23/2897	\N	76	B-3	3/NA	\N	f
325	R23/2898	SHAILESH SINGH	XXXX-XX-4849	\N	3	\N	77	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.782515	2026-07-03 21:19:24.782515	t	2025-01-30	f	\N	R23/2898	SHAILENDRA SINGH	77	B-3	3/NA	2025-01-30	f
326	R23/2900	AMIT KUMAR	XXXX-XX-5106	\N	3	\N	78	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.785411	2026-07-03 21:19:24.785411	f	\N	f	\N	R23/2900	\N	78	B-3	3/NA	\N	f
327	R23/2902	GAYATRI DEVI	XXXX-XX-7112	\N	3	\N	79	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.789454	2026-07-03 21:19:24.789454	f	\N	f	\N	R23/2902	\N	79	B-3	3/NA	\N	f
328	R23/4341	AMAN GARG	XXXX-XX-9518	\N	3	\N	80	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.792344	2026-07-03 21:19:24.792344	f	\N	f	\N	R23/4341	ACHAL KUMAR GUPTA	80	B-3	3/NA	\N	f
329	R23/10676	Vacant	\N	\N	3	\N	81	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.795076	2026-07-03 21:19:24.795076	f	\N	f	\N	R23/10676	\N	81	B-3	3/NA	\N	f
330	R23/2896	UMANG RAGHAV	XXXX-XX-9449	\N	3	\N	82	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.797798	2026-07-03 21:19:24.797798	t	2025-03-29	f	\N	R23/2896	\N	82	B-3	3/NA	2025-03-29	f
331	R23/2899	SAURABH BISHT	XXXX-XX-1929	\N	3	\N	83	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.801307	2026-07-03 21:19:24.801307	f	\N	f	\N	R23/2899	\N	83	B-3	3/NA	\N	f
332	R23/2903	RAJNI YADAV	XXXX-XX-0890	\N	3	\N	84	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.804304	2026-07-03 21:19:24.804304	t	2025-01-17	f	\N	R23/2903	\N	84	B-3	3/NA	2025-01-17	f
333	R23/2901	MAHENDRA PAL GANWAR	XXXX-XX-5105	\N	3	\N	85	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.807488	2026-07-03 21:19:24.807488	f	\N	f	\N	R23/2901	\N	85	B-3	3/NA	\N	f
334	R23/2857	SUNITA MEHRA	XXXX-XX-7676	\N	3	\N	86	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.810433	2026-07-03 21:19:24.810433	t	2023-10-21	f	\N	R23/2857	\N	86	B-3	3/NA	2023-10-21	f
335	R23/2864	MUNENDRA PAL SINGH	XXXX-XX-0082	\N	3	\N	87	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.814236	2026-07-03 21:19:24.814236	f	\N	f	\N	R23/2864	\N	87	B-3	3/NA	\N	f
336	R23/2867	DEEPTI GOSWAMI	XXXX-XX-3555	\N	3	\N	88	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.816868	2026-07-03 21:19:24.816868	t	2025-06-25	f	\N	R23/2867	\N	88	B-3	3/NA	2025-06-25	f
337	R23/2884	BHARAT GAURAV SINHAL	XXXX-XX-6336	\N	3	\N	89	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.820121	2026-07-03 21:19:24.820121	f	\N	f	\N	R23/2884	\N	89	B-3	3/NA	\N	f
338	R23/2889	OM PRAKASH SHARMA	XXXX-XX-0338	\N	3	\N	90	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.822724	2026-07-03 21:19:24.822724	f	\N	f	\N	R23/2889	\N	90	B-3	3/NA	\N	f
339	R23/2891	DHEERAJ RANI	XXXX-XX-2842	\N	3	\N	91	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.826814	2026-07-03 21:19:24.826814	t	2024-10-09	f	\N	R23/2891	\N	91	B-3	3/NA	2024-10-09	f
340	R23/2893	SHRADDHESH KUMAR	XXXX-XX-0077	\N	3	\N	92	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.829695	2026-07-03 21:19:24.829695	t	2025-05-28	f	\N	R23/2893	\N	92	B-3	3/NA	2025-05-28	f
341	R23/2876	YOGANAND SHARMA	XXXX-XX-3480	\N	3	\N	93	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.832248	2026-07-03 21:19:24.832248	f	\N	f	\N	R23/2876	\N	93	B-3	3/NA	\N	f
342	R23/4935	BRAJENDRA SINGH	\N	\N	3	\N	94	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.835065	2026-07-03 21:19:24.835065	f	\N	f	\N	R23/4935	RAMBAHADUR SINGH	94	B-3	3/NA	\N	f
343	R23/2881	VISHAL JUNEJA	XXXX-XX-9344	\N	3	\N	95	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.838426	2026-07-03 21:19:24.838426	f	\N	f	\N	R23/2881	\N	95	B-3	3/NA	\N	f
344	R23/2906	DUSHYANT KUMAR BHARTI	XXXX-XX-4930	\N	3	\N	96	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.841265	2026-07-03 21:19:24.841265	t	2024-10-16	f	\N	R23/2906	\N	96	B-3	3/NA	2024-10-16	f
345	R23/2905	ARCHANA SINGH	XXXX-XX-9899	\N	3	\N	97	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.844131	2026-07-03 21:19:24.844131	t	2025-02-13	f	\N	R23/2905	\N	97	B-3	3/NA	2025-02-13	f
346	R23/4342	KRISHNA MAURYA	XXXX-XX-8962	\N	3	\N	98	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:24.846701	2026-07-03 21:19:24.846701	f	\N	f	\N	R23/4342	\N	98	B-3	3/NA	\N	f
347	R23/9195	JAY SINGH	\N	\N	3	\N	CP-19	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.849644	2026-07-03 21:19:24.849644	t	2024-05-03	f	\N	R23/9195	RAM SINGH	\N	C	3/NA	2024-05-03	f
348	R23/5152	ANITA MUKESH JI	\N	\N	3	\N	01	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.852204	2026-07-03 21:19:24.852204	t	2024-11-29	f	\N	R23/5152	\N	01	C.P	3/NA	2024-11-29	f
349	R23/5094	VANDANA SHARMA, NITIN KUMAR PRABHAKAR	\N	\N	3	\N	02	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.85492	2026-07-03 21:19:24.85492	t	2024-06-06	f	\N	R23/5094	OM PRAKASH	02	C.P	3/NA	2024-06-06	f
350	R23/8092	ANKUR BANSAL	\N	\N	3	\N	1	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.857679	2026-07-03 21:19:24.857679	f	\N	f	\N	R23/8092	\N	\N	C.P	3/NA	\N	f
351	R23/8923	VIVEK KUMAR	XXXX-XX-2125	\N	3	\N	140	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:24.861598	2026-07-03 21:19:24.861598	t	2023-09-23	f	\N	R23/8923	JAMUNA PRASAD GANGAWAR	\N	C.P	3/NA	2023-09-23	f
352	R23/5982	JASWINDER SINGH	XXXX-XX-1111	\N	3	\N	18	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.864394	2026-07-03 21:19:24.864394	t	2024-11-29	f	\N	R23/5982	TAJENDRA PAL SINGH	\N	C.P	3/N.A.	2024-11-29	f
354	R23/8244	KHANDELWAL DISTRIBUTORS PRIVATE LIMITED	XXXX-XX-5480	\N	3	\N	3	\N	residential	12400.00	\N	\N	t	2026-07-03 21:19:24.86993	2026-07-03 21:19:24.86993	t	2025-06-25	f	\N	R23/8244	\N	\N	C.P	3/NA	2025-06-25	f
355	R23/6274	PRADEEP KUMAR	XXXX-XX-9688	\N	3	\N	4	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.872841	2026-07-03 21:19:24.872841	f	\N	f	\N	R23/6274	\N	\N	C.P	3/NA	\N	f
356	R23/4867	SUBODH KUMAR AND SHIVAM AGRWAL	XXXX-XX-1321	\N	3	\N	9	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.875582	2026-07-03 21:19:24.875582	t	2024-07-31	f	\N	R23/4867	\N	9	C.P	3/NA	2024-07-31	f
357	R23/5966	DURGESH KUMAR AND HEMA KHATWANI	XXXX-XX-8844	\N	3	\N	CG-12	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.878405	2026-07-03 21:19:24.878405	t	2024-08-03	f	\N	R23/5966	\N	\N	C.P	3/NA	2024-08-03	f
358	R23/5970	HEMA KHATWANI AND DURGESH KHATWANI	XXXX-XX-8844	\N	3	\N	CG-13	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.880791	2026-07-03 21:19:24.880791	t	2024-08-03	f	\N	R23/5970	\N	\N	C.P	3/NA	2024-08-03	f
359	R23/5948	RISHI BINDAL	XXXX-XX-9444	\N	3	\N	CG-6	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.883905	2026-07-03 21:19:24.883905	f	\N	f	\N	R23/5948	BHISAN CHAND	\N	C.P	3/NA	\N	f
360	R23/5956	SUBODH KUMAR GUPTA	XXXX-XX-2717	\N	3	\N	CP-10	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.88783	2026-07-03 21:19:24.88783	t	2025-03-07	f	\N	R23/5956	RAM AUTAR GUPTA	\N	C.P	3/N.A.	2025-03-07	f
361	R23/5990	VIBHA GUPTA	XXXX-XX-8442	\N	3	\N	CP-15	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.890578	2026-07-03 21:19:24.890578	f	\N	f	\N	R23/5990	\N	\N	C.P	3/NA	\N	f
362	R23/5973	RISHI BINDAL	XXXX-XX-9444	\N	3	\N	CP-16	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.893007	2026-07-03 21:19:24.893007	t	2025-06-06	f	\N	R23/5973	BISAN CHAND	\N	C.P	3/NA	2025-06-06	f
363	R23/5976	MUKESH KUMAR AGARWAL	\N	\N	3	\N	CP-17	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.89615	2026-07-03 21:19:24.89615	t	2025-01-17	f	\N	R23/5976	KRISHNA KUMAR AGARWAL	\N	C.P	3/NA	2025-01-17	f
364	R23/9198	SHIVAM AGARWAL	XXXX-XX-5996	\N	3	\N	CP-2	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.898783	2026-07-03 21:19:24.898783	t	2023-07-13	f	\N	R23/9198	SUBODH AGAGWARL	\N	C.P	3/NA	2023-07-13	f
365	R23/9222	SUNIL KUMAR	\N	\N	3	\N	CP-3	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.901518	2026-07-03 21:19:24.901518	f	\N	f	\N	R23/9222	\N	\N	C.P	3/NA	\N	f
366	R23/5946	SUMIT AGARWAL	XXXX-XX-5138	\N	3	\N	CP-5	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.904727	2026-07-03 21:19:24.904727	t	2025-04-24	f	\N	R23/5946	VISHNU SHANKAR AGARWAL	\N	C.P	3/NA	2025-04-24	f
367	R23/9204	SUBHASH SINGH RAVAT	XXXX-XX-1630	\N	3	\N	CP-6	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.907985	2026-07-03 21:19:24.907985	t	2023-09-13	f	\N	R23/9204	BISAHN SINGH RAVAT	\N	C.P	3/NA	2023-09-13	f
368	R23/5953	SHASANK AGARWAL	XXXX-XX-4866	\N	3	\N	CP-7	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.910561	2026-07-03 21:19:24.910561	f	\N	f	\N	R23/5953	S C AGARWAL	\N	C.P	3/N.A.	\N	f
369	R23/5074	DURGESH KUMAR	XXXX-XX-8844	\N	3	\N	CP-8	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.913112	2026-07-03 21:19:24.913112	t	2024-04-24	f	\N	R23/5074	DEVI DASH	CP-8	C.P	3/N.A.	2024-04-24	f
370	R23/9192	SHASAK PRIDARSHNI	XXXX-XX-4422	\N	3	\N	CP-8	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.915423	2026-07-03 21:19:24.915423	t	2023-01-10	f	\N	R23/9192	JAI PRAKASH SAGAR	\N	C.P	3/NA	2023-01-10	f
371	R23/5962	JITENDRA KHATWANI AND CHARU KHATWANI	XXXX-XX-8811	\N	3	\N	GG-11	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.918614	2026-07-03 21:19:24.918614	t	2024-08-03	f	\N	R23/5962	\N	\N	C.P	3/NA	2024-08-03	f
372	R23/4133	HARDAYAL	XXXX-XX-9429	\N	3	\N	09	\N	residential	240.00	\N	\N	t	2026-07-03 21:19:24.92151	2026-07-03 21:19:24.92151	t	2024-05-27	f	\N	R23/4133	POORAN LAL	09	C.S	3/NA	2024-05-27	f
373	R23/8240	ANITA ARYA	XXXX-XX-1979	\N	3	\N	11	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.924012	2026-07-03 21:19:24.924012	f	\N	f	\N	R23/8240	\N	\N	C.S	3/NA	\N	f
374	R23/8241	RAJEEV KUMAR	XXXX-XX-4436	\N	3	\N	12	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.926656	2026-07-03 21:19:24.926656	f	\N	f	\N	R23/8241	MURARI LAL	\N	C.S	3/NA	\N	f
375	R23/8242	VIKRAM GANGWAR	XXXX-XX-7475	\N	3	\N	13	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.929849	2026-07-03 21:19:24.929849	f	\N	f	\N	R23/8242	NATHU LAL GANGWAR	\N	C.S	3/NA	\N	f
376	R23/8243	PRADEEP KUMAR AGARWAL	XXXX-XX-3174	\N	3	\N	14	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.932627	2026-07-03 21:19:24.932627	f	\N	f	\N	R23/8243	RAM KUMAR AGARWAL	\N	C.S	3/NA	\N	f
377	R23/8267	DEVRAJ	XXXX-XX-0121	\N	3	\N	15	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.935275	2026-07-03 21:19:24.935275	f	\N	f	\N	R23/8267	RAM CHARAN LAL	\N	C.S	3/NA	\N	f
378	R23/8268	KAMLESH KUAMR	XXXX-XX-7660	\N	3	\N	16	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.937743	2026-07-03 21:19:24.937743	f	\N	f	\N	R23/8268	DAL CHAND	\N	C.S	3/NA	\N	f
379	R23/8269	KAMLESH KUMAR	XXXX-XX-7660	\N	3	\N	17	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.940847	2026-07-03 21:19:24.940847	f	\N	f	\N	R23/8269	DAL CHAND	\N	C.S	3/NA	\N	f
380	R23/9224	FUZION	XXXX-XX-0000	\N	3	\N	7	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.943816	2026-07-03 21:19:24.943816	t	2025-03-07	f	\N	R23/9224	\N	\N	C.S	3/NA	2025-03-07	f
381	R23/8252	MANALI AGARWAL	XXXX-XX-1967	\N	3	\N	CC-1	\N	residential	2400.00	\N	\N	t	2026-07-03 21:19:24.947204	2026-07-03 21:19:24.947204	t	2025-05-28	f	\N	R23/8252	ASHISH AGARWAL	\N	C.S	3/NA	2025-05-28	f
382	R23/8263	SHALINI SINGH	XXXX-XX-5712	\N	3	\N	CC-2	\N	residential	2400.00	\N	\N	t	2026-07-03 21:19:24.949698	2026-07-03 21:19:24.949698	f	\N	f	\N	R23/8263	\N	\N	C.S	3/NA	\N	f
383	R23/8388	MAHENDRA KUMAR	XXXX-XX-6656	\N	3	\N	CS-03	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.952888	2026-07-03 21:19:24.952888	t	2022-02-18	f	\N	R23/8388	BUDHPAL	CS-03	C.S	3/NA	2022-02-18	f
384	R23/9223	REETA GUPTA	XXXX-XX-9619	\N	3	\N	CS-33	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:24.955624	2026-07-03 21:19:24.955624	f	\N	f	\N	R23/9223	VAIBHAV GUPTA	\N	C.S	3/NA	\N	f
385	R23/8222	BEENU	XXXX-XX-6430	\N	3	\N	CS-4	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.958045	2026-07-03 21:19:24.958045	t	2022-03-07	f	\N	R23/8222	\N	\N	C.S	3/NA	2022-03-07	f
386	R23/8209	BINU	XXXX-XX-6430	\N	3	\N	CS-5	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.960444	2026-07-03 21:19:24.960444	t	2022-03-07	f	\N	R23/8209	\N	CS-5	C.S	3/NA	2022-03-07	f
387	R23/8221	BEENU	XXXX-XX-6430	\N	3	\N	CS-6	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.963272	2026-07-03 21:19:24.963272	t	2022-03-07	f	\N	R23/8221	\N	CS-6	C.S	3/NA	2022-03-07	f
388	R23/8220	BINU	XXXX-XX-6430	\N	3	\N	CS-7	\N	residential	200.00	\N	\N	t	2026-07-03 21:19:24.96576	2026-07-03 21:19:24.96576	t	2022-03-07	f	\N	R23/8220	\N	\N	C.S	3/NA	2022-03-07	f
389	R23/10760	GEETA SEN	\N	\N	3	\N	126	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.968405	2026-07-03 21:19:24.968405	t	2021-06-25	f	\N	R23/10760	M P SEN	\N	C-1	3/NA	2021-06-25	f
390	R23/7346	ISHU AGARWAL	XXXX-XX-5228	\N	3	\N	06	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.970805	2026-07-03 21:19:24.970805	t	2021-12-06	f	\N	R23/7346	GOPAL CHANDRA SAXENA	\N	C-2	3/NA	2021-12-06	f
391	R23/7405	GIRDHARI LAL VERMA	XXXX-XX-0498	\N	3	\N	1	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.973928	2026-07-03 21:19:24.973928	t	2022-11-19	f	\N	R23/7405	HARIHAR PRASAD	\N	C-2	3/NA	2022-11-19	f
392	R23/7073	BAL MOHIT VERMA	XXXX-XX-4022	\N	3	\N	10	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.977088	2026-07-03 21:19:24.977088	t	2018-03-14	f	\N	R23/7073	AKHILESH CHANDRA	\N	C-2	3/NA	2018-03-14	f
393	R23/6972	RITU MEHROTRA	XXXX-XX-7496	\N	3	\N	100	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.979831	2026-07-03 21:19:24.979831	t	2025-06-20	f	\N	R23/6972	\N	\N	C-2	3/NA	2025-06-20	f
394	R23/7179	RAJIV KUMAR BHATIYA	XXXX-XX-1220	\N	3	\N	101	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.98248	2026-07-03 21:19:24.98248	t	2020-07-16	f	\N	R23/7179	HEERA ;AL BHATIYA	\N	C-2	3/NA	2020-07-16	f
395	R23/7180	RAM PRAVESH SHARMA	XXXX-XX-8395	\N	3	\N	102	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.985453	2026-07-03 21:19:24.985453	t	2018-04-04	f	\N	R23/7180	BHAIYA LAL SHARMA	\N	C-2	3/NA	2018-04-04	f
396	R23/7181	SHRIKRISHNA SAXENA	XXXX-XX-6163	\N	3	\N	103	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.988864	2026-07-03 21:19:24.988864	t	2023-02-14	f	\N	R23/7181	RAM AVTAR SHARMA	\N	C-2	3/NA	2023-02-14	f
397	R23/8812	SADHU RAM SHARMA	\N	\N	3	\N	104	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.991256	2026-07-03 21:19:24.991256	t	2012-03-14	f	\N	R23/8812	ANOKHEY LAL	\N	C-2	3/NA	2012-03-14	f
398	R23/7182	BEENA KHANDELWAL	XXXX-XX-2082	\N	3	\N	105	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.994183	2026-07-03 21:19:24.994183	t	2022-07-23	f	\N	R23/7182	\N	\N	C-2	3/NA	2022-07-23	f
399	R23/7183	BUDHPAL GANGWAR	\N	\N	3	\N	106	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.997237	2026-07-03 21:19:24.997237	t	2022-05-11	f	\N	R23/7183	MEVA RAM GANGWAR	\N	C-2	3/NA	2022-05-11	f
400	R23/7396	ASHOK KUMAR SACHDEVA	\N	\N	3	\N	107	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.999813	2026-07-03 21:19:24.999813	t	2024-02-20	f	\N	R23/7396	VASUDEV SACHDEVA	\N	C-2	3/NA	2024-02-20	f
401	R23/3270	KULDEEP KUMAR SINGH	XXXX-XX-3533	\N	3	\N	108	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.00251	2026-07-03 21:19:25.00251	f	\N	f	\N	R23/3270	JAGDISHWAR SINGH	108	C-2	3/NA	\N	f
402	R23/4284	PRIYANKA SINGH	XXXX-XX-9906	\N	3	\N	108A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.005055	2026-07-03 21:19:25.005055	f	\N	f	\N	R23/4284	\N	108A	C-2	3/NA	\N	f
403	R23/7184	UMA GANGWAR	XXXX-XX-4770	\N	3	\N	109	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.00817	2026-07-03 21:19:25.00817	t	2022-01-07	f	\N	R23/7184	\N	\N	C-2	3/NA	2022-01-07	f
353	R23/5069	JAY SINGH	\N	\N	3	\N	19	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:24.867336	2026-07-03 21:19:24.867336	f	\N	f	\N	R23/5069	\N	19	C.P	3/NA	\N	f
404	R23/3262	CHANDNI DUBEY	XXXX-XX-4544	\N	3	\N	11	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.010781	2026-07-03 21:19:25.010781	t	2024-02-24	f	\N	R23/3262	\N	11	C-2	3/NA	2024-02-24	f
405	R23/8852	BHANWAR PAL SINGH	\N	\N	3	\N	110	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.013716	2026-07-03 21:19:25.013716	t	2024-12-26	f	\N	R23/8852	SOBHA RAM GANGWAR	\N	C-2	3/NA	2024-12-26	f
406	R23/7226	SIA RAM	XXXX-XX-5673	\N	3	\N	111	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.015942	2026-07-03 21:19:25.015942	t	2022-03-29	f	\N	R23/7226	DEENA NATH	\N	C-2	3/NA	2022-03-29	f
407	R23/6818	GHANSHIAM SHARMA	\N	\N	3	\N	112	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.019205	2026-07-03 21:19:25.019205	f	\N	f	\N	R23/6818	BHAGWATI PRASAD	\N	C-2	3/NA	\N	f
408	R23/10757	VIDHOTMA GANGWAR	\N	\N	3	\N	113	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.021693	2026-07-03 21:19:25.021693	t	2022-12-24	f	\N	R23/10757	HARI KRISHNA GANGWAR	\N	C-2	3/NA	2022-12-24	f
409	R23/7228	RENU SINGH	\N	\N	3	\N	114	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.024399	2026-07-03 21:19:25.024399	t	2018-10-30	f	\N	R23/7228	\N	\N	C-2	3/N.A.	2018-10-30	f
410	R23/7229	SANJU AGARWAL	\N	\N	3	\N	115	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.027266	2026-07-03 21:19:25.027266	t	2022-05-26	f	\N	R23/7229	GOPAL KRISHNA	\N	C-2	3/NA	2022-05-26	f
411	R23/7230	NITIN KUMAR SAXENA	XXXX-XX-8209	\N	3	\N	116	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.030173	2026-07-03 21:19:25.030173	t	2020-06-15	f	\N	R23/7230	MOHNI KUMAR SAXENA	\N	C-2	3/NA	2020-06-15	f
412	R23/7231	OMKAR	\N	\N	3	\N	117	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.033164	2026-07-03 21:19:25.033164	t	2022-04-26	f	\N	R23/7231	RAM SANEHI LAL	\N	C-2	3/NA	2022-04-26	f
413	R23/7232	BHANU PRATAP SINGH	\N	\N	3	\N	118	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.035499	2026-07-03 21:19:25.035499	t	2019-07-23	f	\N	R23/7232	SUNDER SINGH	\N	C-2	3/NA	2019-07-23	f
414	R23/7414	PRIYA AGARWAL	\N	\N	3	\N	119	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.038378	2026-07-03 21:19:25.038378	t	2008-02-19	f	\N	R23/7414	\N	\N	C-2	3/NA	2008-02-19	f
415	R23/7074	SANTOSH SAXENA	XXXX-XX-5514	\N	3	\N	12	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.041073	2026-07-03 21:19:25.041073	t	2017-11-10	f	\N	R23/7074	MUNISH BABOO SAXENA	\N	C-2	3/NA	2017-11-10	f
416	R23/7233	DIGVIJAY SINGH	\N	\N	3	\N	120	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.043708	2026-07-03 21:19:25.043708	t	2008-08-02	f	\N	R23/7233	DARIPAL SINGH	\N	C-2	3/NA	2008-08-02	f
417	R23/7234	BANKEY LAL GAUTAM	\N	\N	3	\N	121	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.046217	2026-07-03 21:19:25.046217	t	2008-12-30	f	\N	R23/7234	CHUNNI LAL	\N	C-2	3/NA	2008-12-30	f
418	R23/10759	GOPAL KRISHNA GOYAL	\N	\N	3	\N	122	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.049059	2026-07-03 21:19:25.049059	t	2009-05-22	f	\N	R23/10759	MADAN LAL	\N	C-2	3/NA	2009-05-22	f
419	R23/7235	PRAGYA MISHRA	\N	\N	3	\N	123	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.051506	2026-07-03 21:19:25.051506	t	2019-11-05	f	\N	R23/7235	\N	\N	C-2	3/NA	2019-11-05	f
420	R23/6827	DURGESH BABU	\N	\N	3	\N	124	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.054144	2026-07-03 21:19:25.054144	f	\N	f	\N	R23/6827	RAM PRAKASH BABU	\N	C-2	3/NA	\N	f
421	R23/7236	AMAR SINGH VERMA	\N	\N	3	\N	125	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.056543	2026-07-03 21:19:25.056543	t	2008-07-15	f	\N	R23/7236	DHODE VERMA	\N	C-2	3/NA	2008-07-15	f
422	R23/11917	PANKAJ KUMAR	XXXX-XX-7255	\N	3	\N	126	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.059481	2026-07-03 21:19:25.059481	t	2007-08-07	f	\N	R23/11917	\N	\N	C-2	3/NA	2007-08-07	f
423	R23/7238	ROHIT SINGH	\N	\N	3	\N	127	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.061781	2026-07-03 21:19:25.061781	t	2018-10-11	f	\N	R23/7238	DIGVIJAY SINGH	\N	C-2	3/NA	2018-10-11	f
424	R23/7239	MUKTA GANGWAR	\N	\N	3	\N	128	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.064087	2026-07-03 21:19:25.064087	t	2008-06-19	f	\N	R23/7239	\N	\N	C-2	3/NA	2008-06-19	f
425	R23/7240	VIJAY KUMAR SHARMA	XXXX-XX-1947	\N	3	\N	129	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.06664	2026-07-03 21:19:25.06664	t	2018-07-09	f	\N	R23/7240	A P SHARMA	\N	C-2	3/NA	2018-07-09	f
426	R23/6798	VIVEK AGARWAL	XXXX-XX-4499	\N	3	\N	13	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.069978	2026-07-03 21:19:25.069978	t	2025-01-30	f	\N	R23/6798	SHIVOM SHANKER AGARWAL	\N	C-2	3/NA	2025-01-30	f
427	R23/7241	AJAY KUMAR SHARMA	XXXX-XX-1947	\N	3	\N	130	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.076548	2026-07-03 21:19:25.076548	t	2018-06-27	f	\N	R23/7241	A P SHARMA	\N	C-2	3/NA	2018-06-27	f
478	R23/7263	SHIV KUMAR SINGH	XXXX-XX-3308	\N	3	\N	179	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.231285	2026-07-03 21:19:25.231285	t	2020-02-15	f	\N	R23/7263	\N	DAYA RAM	C-2	3/NA	2020-02-15	f
428	R23/4086	BRAHMA PAL SINGH	XXXX-XX-3912	\N	3	\N	131	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.079129	2026-07-03 21:19:25.079129	t	2024-02-02	f	\N	R23/4086	LATE NATTHU SINGH	131	C-2	3/NA	2024-02-02	f
429	R23/7242	GUNJAN CHAUDHRY	XXXX-XX-1153	\N	3	\N	132	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.081895	2026-07-03 21:19:25.081895	t	2022-07-23	f	\N	R23/7242	\N	\N	C-2	3/NA	2022-07-23	f
431	R23/8786	HARMEET SINGH BAGGA	XXXX-XX-0081	\N	3	\N	134	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.088033	2026-07-03 21:19:25.088033	t	2022-11-22	f	\N	R23/8786	DILJEET SINGH BAGGA	\N	C-2	3/NA	2022-11-22	f
432	R23/7243	ANIL KUMAR TIWARI	XXXX-XX-1681	\N	3	\N	135	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.09106	2026-07-03 21:19:25.09106	t	2022-12-17	f	\N	R23/7243	\N	\N	C-2	3/NA	2022-12-17	f
433	R23/10762	KESHAV KUMAR SINGH	\N	\N	3	\N	136	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.093795	2026-07-03 21:19:25.093795	t	2019-06-22	f	\N	R23/10762	VIDYA NAND SINGH	\N	C-2	3/NA	2019-06-22	f
434	R23/8785	PANKAJ KUMAR SAXENA	XXXX-XX-5694	\N	3	\N	137	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.098456	2026-07-03 21:19:25.098456	t	2023-03-21	f	\N	R23/8785	GIRISH CHNDRA SAXENA	\N	C-2	3/NA	2023-03-21	f
435	R23/7244	RAJKUMAR VERMA	XXXX-XX-9395	\N	3	\N	138	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.101064	2026-07-03 21:19:25.101064	t	2021-07-13	f	\N	R23/7244	RAMESWARPUR VERMA	\N	C-2	3/NA	2021-07-13	f
436	R23/7418	NEETU	XXXX-XX-4144	\N	3	\N	139	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.104172	2026-07-03 21:19:25.104172	t	2024-04-25	f	\N	R23/7418	\N	\N	C-2	3/NA	2024-04-25	f
437	R23/7075	SHWETA KANAUJIA	XXXX-XX-7687	\N	3	\N	14	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.107033	2026-07-03 21:19:25.107033	t	2018-05-15	f	\N	R23/7075	\N	\N	C-2	3/NA	2018-05-15	f
438	R23/8806	SUBHASH CHAND MISHRA	\N	\N	3	\N	140	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.110403	2026-07-03 21:19:25.110403	t	2007-07-19	f	\N	R23/8806	KHUSH HAL MISHRA	\N	C-2	3/NA	2007-07-19	f
439	R23/7247	BRAJESH KUMAR YADAV	\N	\N	3	\N	141	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.113074	2026-07-03 21:19:25.113074	t	2021-03-27	f	\N	R23/7247	RAM BACHAN YADAV	\N	C-2	3/NA	2021-03-27	f
440	R23/8787	RAVI PDRATAP SINGH	XXXX-XX-9830	\N	3	\N	142	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.115925	2026-07-03 21:19:25.115925	t	2023-04-11	f	\N	R23/8787	BALVEER SINGH	\N	C-2	3/NA	2023-04-11	f
441	R23/5082	SAURABH MISHRA	\N	\N	3	\N	145	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.118373	2026-07-03 21:19:25.118373	t	2024-05-16	f	\N	R23/5082	\N	145	C-2	3/NA	2024-05-16	f
442	R23/3161	CHANDRA KIRAN	\N	\N	3	\N	146	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.121851	2026-07-03 21:19:25.121851	t	2023-09-02	f	\N	R23/3161	UMA SHANKAR	146	C-2	3/NA	2023-09-02	f
443	R23/6829	LEENA RANI	XXXX-XX-9595	\N	3	\N	147	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.124616	2026-07-03 21:19:25.124616	f	\N	f	\N	R23/6829	\N	\N	C-2	3/NA	\N	f
444	R23/7249	GAJENDRA SINGH	XXXX-XX-7222	\N	3	\N	148	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.128148	2026-07-03 21:19:25.128148	t	2022-09-30	f	\N	R23/7249	SURENDRA SINGH	\N	C-2	3/NA	2022-09-30	f
445	R23/6832	HARESH CHANDRA SIDHWANI	XXXX-XX-8832	\N	3	\N	149	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.131078	2026-07-03 21:19:25.131078	f	\N	f	\N	R23/6832	SATYA PAL SIDHWANI	\N	C-2	3/NA	\N	f
446	R23/3188	NEETA RANI	XXXX-XX-9378	\N	3	\N	150	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.134317	2026-07-03 21:19:25.134317	t	2024-03-12	f	\N	R23/3188	JANKI PRASAD	150	C-2	3/NA	2024-03-12	f
447	R23/8804	ARVIND KUMAR	XXXX-XX-0860	\N	3	\N	151	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.136945	2026-07-03 21:19:25.136945	t	2024-03-02	f	\N	R23/8804	RAMA DIN	\N	C-2	3/NA	2024-03-02	f
448	R23/6833	RAJNI SHUKLA	XXXX-XX-9095	\N	3	\N	152	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.140284	2026-07-03 21:19:25.140284	f	\N	f	\N	R23/6833	\N	\N	C-2	3/NA	\N	f
449	R23/2541	VIVHORE GUPTA	XXXX-XX-4473	\N	3	\N	153	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.143123	2026-07-03 21:19:25.143123	t	2023-09-12	f	\N	R23/2541	\N	153	C-2	3/NA	2023-09-12	f
450	R23/6836	SHASHI BALA	XXXX-XX-4460	\N	3	\N	154	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.1461	2026-07-03 21:19:25.1461	f	\N	f	\N	R23/6836	JANKI PRASAD	\N	C-2	3/NA	\N	f
451	R23/7251	ANJALI YADAV	XXXX-XX-6739	\N	3	\N	155	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.149299	2026-07-03 21:19:25.149299	t	2021-12-24	f	\N	R23/7251	SAHAB YADAV	\N	C-2	3/NA	2021-12-24	f
452	R23/6840	PRADEEP KUMAR SINGH	XXXX-XX-3496	\N	3	\N	156	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.152639	2026-07-03 21:19:25.152639	t	2025-03-07	f	\N	R23/6840	MAHAVEER SINGH	\N	C-2	3/NA	2025-03-07	f
453	R23/6841	NIRANJANA PANDEY	XXXX-XX-6437	\N	3	\N	157	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.155487	2026-07-03 21:19:25.155487	f	\N	f	\N	R23/6841	\N	\N	C-2	3/NA	\N	f
454	R23/5136	RAM KUMAR SINGH	\N	\N	3	\N	158	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.158597	2026-07-03 21:19:25.158597	t	2024-07-31	f	\N	R23/5136	\N	158	C-2	3/NA	2024-07-31	f
455	R23/8819	AVNISH KUMARI	\N	\N	3	\N	159	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.161425	2026-07-03 21:19:25.161425	t	2022-06-29	f	\N	R23/8819	JUGEL KISHORE	\N	C-2	3/NA	2022-06-29	f
456	R23/7076	ANITA BHATIA	XXXX-XX-5703	\N	3	\N	16	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.164527	2026-07-03 21:19:25.164527	t	2018-04-18	f	\N	R23/7076	\N	\N	C-2	3/NA	2018-04-18	f
457	R23/8788	SANJAY KUMAR	\N	\N	3	\N	160	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.167667	2026-07-03 21:19:25.167667	t	2023-09-02	f	\N	R23/8788	RAJENDRA PRASAD	\N	C-2	3/NA	2023-09-02	f
458	R23/8790	NITIN PAPNEJA	XXXX-XX-4701	\N	3	\N	161	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.170802	2026-07-03 21:19:25.170802	t	2023-08-19	f	\N	R23/8790	SURENDRA KUMAR PAPNEJA	\N	C-2	3/NA	2023-08-19	f
459	R23/7421	ASHOK KUMAR	XXXX-XX-1155	\N	3	\N	162	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.173459	2026-07-03 21:19:25.173459	t	2024-02-06	f	\N	R23/7421	SHATRUGHAN DAS	\N	C-2	3/NA	2024-02-06	f
460	R23/7253	KAUSHAL PATEL	XXXX-XX-3447	\N	3	\N	163	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.17661	2026-07-03 21:19:25.17661	t	2023-03-26	f	\N	R23/7253	UDAYVEER SINGH	\N	C-2	3/NA	2023-03-26	f
461	R23/7254	SUNNY KHAN	XXXX-XX-1314	\N	3	\N	164	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.18066	2026-07-03 21:19:25.18066	t	2022-06-28	f	\N	R23/7254	NAIRUDDIN KHAN	\N	C-2	3/NA	2022-06-28	f
462	R23/6842	TRILOK SHARMA	XXXX-XX-9799	\N	3	\N	165	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.18426	2026-07-03 21:19:25.18426	f	\N	f	\N	R23/6842	NARENDRA SHARMA	\N	C-2	3/NA	\N	f
463	R23/8792	SATENDRA KUMAR SAXENA	XXXX-XX-9960	\N	3	\N	166	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.186917	2026-07-03 21:19:25.186917	t	2023-07-13	f	\N	R23/8792	SUKHNANDHAN PRASAD SAXENA	\N	C-2	3/NA	2023-07-13	f
464	R23/8793	CHHAVI MOHAN SAXENA	XXXX-XX-4548	\N	3	\N	167	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.189987	2026-07-03 21:19:25.189987	t	2022-09-19	f	\N	R23/8793	R N SAXENA	\N	C-2	3/NA	2022-09-19	f
465	R23/7256	LALIT MOHAN	XXXX-XX-5321	\N	3	\N	168	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.192697	2026-07-03 21:19:25.192697	t	2018-05-06	f	\N	R23/7256	DATA RAM GANGWAR	\N	C-2	3/NA	2018-05-06	f
466	R23/8794	RAKESH KUMAR SINGHAL	\N	\N	3	\N	169	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.19571	2026-07-03 21:19:25.19571	t	2023-08-23	f	\N	R23/8794	INDRA SWAROOP	\N	C-2	3/NA	2023-08-23	f
467	R23/10761	VIVEK GAUR	XXXX-XX-0630	\N	3	\N	17	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.198438	2026-07-03 21:19:25.198438	t	2021-08-11	f	\N	R23/10761	RAMESH PRASHAD GAUR	\N	C-2	3/NA	2021-08-11	f
468	R23/7258	ANAND	XXXX-XX-1200	\N	3	\N	170	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.201675	2026-07-03 21:19:25.201675	t	2019-12-03	f	\N	R23/7258	AYODHYA PRASAD	\N	C-2	3/NA	2019-12-03	f
469	R23/7260	MAHESH KUMAR	XXXX-XX-9512	\N	3	\N	171	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.20456	2026-07-03 21:19:25.20456	t	2020-07-27	f	\N	R23/7260	PREMRAJ	\N	C-2	3/NA	2020-07-27	f
470	R23/4027	SURENDRA KUMAR	XXXX-XX-6148	\N	3	\N	172	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.207931	2026-07-03 21:19:25.207931	t	2024-11-20	f	\N	R23/4027	GAURI SHANKAR GUPTA	172	C-2	3/NA	2024-11-20	f
471	R23/6850	ANITA ANAND	XXXX-XX-7896	\N	3	\N	173	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.210792	2026-07-03 21:19:25.210792	t	2024-11-29	f	\N	R23/6850	\N	\N	C-2	3/NA	2024-11-29	f
472	R23/8818	RENU MATHUR	\N	\N	3	\N	174	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.214378	2026-07-03 21:19:25.214378	t	2021-09-18	f	\N	R23/8818	ANIL KUMAR MATHUR	\N	C-2	3/NA	2021-09-18	f
473	R23/2363	SAISTA KHATOON	XXXX-XX-5920	\N	3	\N	174A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.21727	2026-07-03 21:19:25.21727	t	2025-01-30	f	\N	R23/2363	\N	\N	C-2	3/NA	2025-01-30	f
474	R23/8796	SANJEEV KUMAR	\N	\N	3	\N	175	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.220054	2026-07-03 21:19:25.220054	t	2022-12-06	f	\N	R23/8796	MAHENDRA NATH	\N	C-2	3/NA	2022-12-06	f
475	R23/7261	RAKESH KUMAR MAURYA	XXXX-XX-9740	\N	3	\N	176	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.222726	2026-07-03 21:19:25.222726	t	2021-10-27	f	\N	R23/7261	LALTA PRASAD MAURYA	\N	C-2	3/NA	2021-10-27	f
476	R23/4897	ABHISHEK GANGWAR	\N	\N	3	\N	177	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.225693	2026-07-03 21:19:25.225693	t	2023-05-16	f	\N	R23/4897	CHHATRA PAL GANGWAR	177	C-2	3/NA	2023-05-16	f
477	R23/6927	DEEPAK SINGHAL	XXXX-XX-7237	\N	3	\N	178	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.22821	2026-07-03 21:19:25.22821	t	2025-03-07	f	\N	R23/6927	SHYAM MANOHAR SINGHAL	\N	C-2	3/NA	2025-03-07	f
479	R23/7077	SANJEEV KUMAR AGARWAL	XXXX-XX-5120	\N	3	\N	18	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.233985	2026-07-03 21:19:25.233985	t	2019-10-30	f	\N	R23/7077	MOHAN LAL AGARWAL	\N	C-2	3/NA	2019-10-30	f
480	R23/6929	HARENDRA PAL SINGH	XXXX-XX-2142	\N	3	\N	180	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.237104	2026-07-03 21:19:25.237104	t	2025-01-30	f	\N	R23/6929	NATHU LAL PAL	\N	C-2	3/NA	2025-01-30	f
481	R23/7265	INDUBALA	XXXX-XX-5367	\N	3	\N	181	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.239763	2026-07-03 21:19:25.239763	t	2022-08-30	f	\N	R23/7265	ARVIND KUMAR MAURYA	\N	C-2	3/NA	2022-08-30	f
482	R23/6930	SANGEETA GUPTA	XXXX-XX-9000	\N	3	\N	182	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.242578	2026-07-03 21:19:25.242578	t	2025-02-13	f	\N	R23/6930	\N	\N	C-2	3/NA	2025-02-13	f
483	R23/7267	PRIYANKA GANGWAR	XXXX-XX-5551	\N	3	\N	183	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.245324	2026-07-03 21:19:25.245324	t	2021-03-26	f	\N	R23/7267	DWIJENDRA SINGH GANAWAR	\N	C-2	3/NA	2021-03-26	f
484	R23/7268	PRITI RANI	XXXX-XX-1880	\N	3	\N	184	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.248396	2026-07-03 21:19:25.248396	t	2021-08-12	f	\N	R23/7268	\N	\N	C-2	3/NA	2021-08-12	f
485	R23/7269	KULDEEP KUMAR BHATT	XXXX-XX-4945	\N	3	\N	185	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.251499	2026-07-03 21:19:25.251499	t	2022-04-28	f	\N	R23/7269	MAKHAN LAL BHATT	\N	C-2	3/NA	2022-04-28	f
486	R23/7270	CHANDRA BHAN	XXXX-XX-8825	\N	3	\N	187	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.254726	2026-07-03 21:19:25.254726	t	2020-10-31	f	\N	R23/7270	RAMPAL GUPTA	\N	C-2	3/NA	2020-10-31	f
487	R23/10763	CHITRA AGARWAL	XXXX-XX-0185	\N	3	\N	188	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.257294	2026-07-03 21:19:25.257294	t	2025-01-30	f	\N	R23/10763	\N	\N	C-2	3/NA	2025-01-30	f
488	R23/5089	DIVYA RATN RATHOUR	XXXX-XX-4466	\N	3	\N	189	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.260875	2026-07-03 21:19:25.260875	t	2025-03-07	f	\N	R23/5089	RATNESH CHANDRA	189	C-2	3/NA	2025-03-07	f
489	R23/7079	ASHOK BANSAL	XXXX-XX-2805	\N	3	\N	19	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.263768	2026-07-03 21:19:25.263768	t	2022-06-30	f	\N	R23/7079	HIRA LAL BANSAL	\N	C-2	3/NA	2022-06-30	f
490	R23/6932	AMAN GUPTA	XXXX-XX-5009	\N	3	\N	190	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.26712	2026-07-03 21:19:25.26712	t	2025-02-13	f	\N	R23/6932	KISHAN LAL GUPTA	\N	C-2	3/NA	2025-02-13	f
491	R23/6943	POOJA GANGWAR	XXXX-XX-8419	\N	3	\N	191	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.269661	2026-07-03 21:19:25.269661	f	\N	f	\N	R23/6943	JITENRA GANGWAR	\N	C-2	3/NA	\N	f
492	R23/4025	JAYANTI KUMAR	XXXX-XX-2844	\N	3	\N	192	\N	residential	0.00	\N	\N	t	2026-07-03 21:19:25.272713	2026-07-03 21:19:25.272713	t	2024-08-29	f	\N	R23/4025	JITENDRA KUMAR OJHA	192	C-2	3/NA	2024-08-29	f
493	R23/8797	PAWAN KUMAR AGARWAL	\N	\N	3	\N	193	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.275163	2026-07-03 21:19:25.275163	t	2023-03-27	f	\N	R23/8797	RATAN KUMAR AGARWAL	\N	C-2	3/NA	2023-03-27	f
494	R23/6945	JASWINDER SINGH	XXXX-XX-1111	\N	3	\N	193A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.278165	2026-07-03 21:19:25.278165	t	2025-06-25	f	\N	R23/6945	TAJINDER PAL SINGH	\N	C-2	3/NA	2025-06-25	f
495	R23/6946	MAHIMA DEVI	XXXX-XX-1144	\N	3	\N	193B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.280776	2026-07-03 21:19:25.280776	t	2025-03-07	f	\N	R23/6946	\N	\N	C-2	3/NA	2025-03-07	f
496	R23/7423	DIVYA SAXENA	XXXX-XX-7022	\N	3	\N	193C	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.283982	2026-07-03 21:19:25.283982	t	2024-04-24	f	\N	R23/7423	\N	\N	C-2	3/NA	2024-04-24	f
497	R23/4286	SUSHOBHIT GANGWAR	XXXX-XX-4859	\N	3	\N	193D	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.286708	2026-07-03 21:19:25.286708	f	\N	f	\N	R23/4286	SHRI RAM GANGWAR	193D	C-2	3/NA	\N	f
498	R23/8391	VED PRAKASH	XXXX-XX-9882	\N	3	\N	194	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.29	2026-07-03 21:19:25.29	t	2023-03-25	f	\N	R23/8391	SIYA RAM SHAKYA	194	C-2	3/NA	2023-03-25	f
499	R23/8390	ARCHANA KUMARI	XXXX-XX-0778	\N	3	\N	197	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:25.292683	2026-07-03 21:19:25.292683	t	2021-10-22	f	\N	R23/8390	AJIT KUMAR	197	C-2	3/NA	2021-10-22	f
500	R23/8389	MANESH KUMAR	XXXX-XX-3040	\N	3	\N	198	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.295888	2026-07-03 21:19:25.295888	t	2022-06-04	f	\N	R23/8389	KRISHNA PAL GANGWAR	198	C-2	3/NA	2022-06-04	f
501	R23/9211	RAGNI	\N	\N	3	\N	199	\N	residential	112500.00	\N	\N	t	2026-07-03 21:19:25.298627	2026-07-03 21:19:25.298627	t	2021-12-10	f	\N	R23/9211	SABHUV AGARWAL	\N	C-2	3/NA	2021-12-10	f
502	R23/7066	ARJUN TANDON	XXXX-XX-0191	\N	3	\N	2	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.301919	2026-07-03 21:19:25.301919	t	2021-02-02	f	\N	R23/7066	VIJAY KUMAR TANDAN	\N	C-2	3/NA	2021-02-02	f
503	R23/7081	NEHA SHARMA	XXXX-XX-3500	\N	3	\N	20	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.305253	2026-07-03 21:19:25.305253	t	2022-03-29	f	\N	R23/7081	\N	\N	C-2	3/NA	2022-03-29	f
504	R23/8393	PRAVEEN GARG	\N	\N	3	\N	200	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.308527	2026-07-03 21:19:25.308527	t	2012-01-10	f	\N	R23/8393	SURESH CHANDRA GARG	200	C-2	3/NA	2012-01-10	f
505	R23/8395	SATISH KUMAR	\N	\N	3	\N	201	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.311361	2026-07-03 21:19:25.311361	t	2008-02-14	f	\N	R23/8395	RAJENDRA SINGH	201	C-2	3/NA	2008-02-14	f
506	R23/8396	SANTRAM	\N	\N	3	\N	202	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.314866	2026-07-03 21:19:25.314866	t	2012-03-31	f	\N	R23/8396	RAMPAL SINGH	202	C-2	3/NA	2012-03-31	f
507	R23/8397	GAURAM AGARWAL	\N	\N	3	\N	203	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.317884	2026-07-03 21:19:25.317884	t	2008-09-19	f	\N	R23/8397	RADHEY SHAYAM AGARWAL	203	C-2	3/NA	2008-09-19	f
508	R23/8398	MANOJ KUMAR	\N	\N	3	\N	204	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.321174	2026-07-03 21:19:25.321174	t	2008-02-14	f	\N	R23/8398	RAJENDRA SINGH	204	C-2	3/NA	2008-02-14	f
509	R23/8399	MAHESH CHNDRA GUPTA	\N	\N	3	\N	205	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.323976	2026-07-03 21:19:25.323976	t	2009-10-19	f	\N	R23/8399	PRALADH GUPTA	205	C-2	3/NA	2009-10-19	f
510	R23/8401	MEENA	\N	\N	3	\N	206	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.327902	2026-07-03 21:19:25.327902	t	2019-08-02	f	\N	R23/8401	R S PUSHKAR	406	C-2	3/NA	2019-08-02	f
511	R23/8868	PUSHPA GANGWAR	XXXX-XX-0026	\N	3	\N	207	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.330856	2026-07-03 21:19:25.330856	t	2022-02-22	f	\N	R23/8868	\N	\N	C-2	3/NA	2022-02-22	f
512	R23/8870	PUSHPA GANGWAR	XXXX-XX-0026	\N	3	\N	208	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.333715	2026-07-03 21:19:25.333715	t	2022-02-22	f	\N	R23/8870	RAMESH CHANDRA	\N	C-2	3/NA	2022-02-22	f
513	R23/8871	PUSHPA GANGWAR	XXXX-XX-0026	\N	3	\N	209	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.336481	2026-07-03 21:19:25.336481	t	2022-02-22	f	\N	R23/8871	\N	\N	C-2	3/NA	2022-02-22	f
514	R23/10758	OM PRAKASH	XXXX-XX-9049	\N	3	\N	21	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.339436	2026-07-03 21:19:25.339436	t	2017-09-27	f	\N	R23/10758	KALI CHARAN	\N	C-2	3/NA	2017-09-27	f
515	R23/8872	PUSHPA GANGWAR	\N	\N	3	\N	210	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.342829	2026-07-03 21:19:25.342829	t	2022-02-22	f	\N	R23/8872	RAMESH CHANDRA	\N	C-2	3/N.A.	2022-02-22	f
516	R23/8873	PUSHPA GANGWAR	\N	\N	3	\N	211	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.345597	2026-07-03 21:19:25.345597	t	2022-02-22	f	\N	R23/8873	\N	\N	C-2	3/NA	2022-02-22	f
517	R23/8874	PUSHPA GANGWAR	\N	\N	3	\N	212	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.348503	2026-07-03 21:19:25.348503	t	2022-02-22	f	\N	R23/8874	RAMESH CHANDRA	\N	C-2	3/NA	2022-02-22	f
518	R23/8875	PANKAJ KUMAR	XXXX-XX-0589	\N	3	\N	213	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.352067	2026-07-03 21:19:25.352067	t	2022-04-06	f	\N	R23/8875	RUMAL SINGH	\N	C-2	3/NA	2022-04-06	f
519	R23/8876	PRIYANKA SINGH	\N	\N	3	\N	214	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.354913	2026-07-03 21:19:25.354913	t	2022-03-02	f	\N	R23/8876	YASVEER SINGH	\N	C-2	3/NA	2022-03-02	f
520	R23/8877	KRITIKA SHARMA	\N	\N	3	\N	215	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.357909	2026-07-03 21:19:25.357909	t	2022-03-16	f	\N	R23/8877	KOTILYA SHARMA	\N	C-2	3/NA	2022-03-16	f
521	R23/8878	NAVEEN KUMAR	XXXX-XX-3174	\N	3	\N	216	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.360664	2026-07-03 21:19:25.360664	t	2022-07-23	f	\N	R23/8878	RAJENDRA SINGH	\N	C-2	3/NA	2022-07-23	f
522	R23/8879	KANAK TRIPATHI	XXXX-XX-8026	\N	3	\N	217	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.363339	2026-07-03 21:19:25.363339	t	2022-02-18	f	\N	R23/8879	KAILASH SHANKAR TIWARI	\N	C-2	3/NA	2022-02-18	f
523	R23/8880	MAYANK PATEL	\N	\N	3	\N	218	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.366109	2026-07-03 21:19:25.366109	t	2022-02-18	f	\N	R23/8880	PUTTU SINGH	\N	C-2	3/NA	2022-02-18	f
524	R23/7083	NEETU GUPTA	XXXX-XX-6820	\N	3	\N	22	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.368858	2026-07-03 21:19:25.368858	t	2021-03-22	f	\N	R23/7083	\N	\N	C-2	3/NA	2021-03-22	f
525	R23/7085	SATENDRA HYANKI	XXXX-XX-0470	\N	3	\N	23	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.371431	2026-07-03 21:19:25.371431	t	2022-05-31	f	\N	R23/7085	HARI KISHAN SINGH HAYANKI	\N	C-2	3/NA	2022-05-31	f
526	R23/7089	FAIZ SHAMSI	XXXX-XX-0347	\N	3	\N	24	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.373903	2026-07-03 21:19:25.373903	t	2019-08-30	f	\N	R23/7089	ZIA UR REHMAN	\N	C-2	3/NA	2019-08-30	f
544	R23/4452	SACHIN SHARMA	\N	\N	3	\N	26	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.423834	2026-07-03 21:19:25.423834	f	\N	f	\N	R23/4452	\N	26	C-2	3/NA	\N	f
527	R23/8402	SUBODH DHAWALN	\N	\N	3	\N	245	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.376276	2026-07-03 21:19:25.376276	t	2019-09-04	f	\N	R23/8402	SRI NATH DAWAN	245	C-2	3/NA	2019-09-04	f
528	R23/8403	DINESH KUMAR	XXXX-XX-8895	\N	3	\N	245A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.378995	2026-07-03 21:19:25.378995	t	2018-05-24	f	\N	R23/8403	PARAGI LAL	245A	C-2	3/NA	2018-05-24	f
529	R23/8404	SEEMA	\N	\N	3	\N	246	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.381699	2026-07-03 21:19:25.381699	t	2008-12-26	f	\N	R23/8404	S C GANGWAR	246	C-2	3/NA	2008-12-26	f
530	R23/8405	SADHANA AGARWAL	\N	\N	3	\N	247	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.384787	2026-07-03 21:19:25.384787	t	2010-08-28	f	\N	R23/8405	ASEEM KUMAR AGARWAL	247	C-2	3/NA	2010-08-28	f
531	R23/8406	RAM BIHARI SINGH	\N	\N	3	\N	248	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.387278	2026-07-03 21:19:25.387278	t	2012-03-30	f	\N	R23/8406	SARDAR SINGH	248	C-2	3/NA	2012-03-30	f
532	R23/8407	KRISHNA JOSHI	\N	\N	3	\N	249	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.390301	2026-07-03 21:19:25.390301	t	2007-08-07	f	\N	R23/8407	TIKARAM JOSHI	249	C-2	3/NA	2007-08-07	f
533	R23/7090	SHIV ANAND SINGH	XXXX-XX-9928	\N	3	\N	24A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.393422	2026-07-03 21:19:25.393422	t	2018-05-14	f	\N	R23/7090	RAM SHANEHI LAL	\N	C-2	3/NA	2018-05-14	f
534	R23/7091	SHIKHA SAXENA	XXXX-XX-8242	\N	3	\N	24B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.396115	2026-07-03 21:19:25.396115	t	2017-12-29	f	\N	R23/7091	\N	\N	C-2	3/NA	2017-12-29	f
535	R23/8809	SHARDHA VERMA	\N	\N	3	\N	25	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.398596	2026-07-03 21:19:25.398596	t	2021-10-12	f	\N	R23/8809	K K VERMA	\N	C-2	3/NA	2021-10-12	f
536	R23/8408	RAMADEVI	\N	\N	3	\N	250	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.401136	2026-07-03 21:19:25.401136	t	2009-03-15	f	\N	R23/8408	LALLU SINGH MOURYA	250	C-2	3/NA	2009-03-15	f
537	R23/8409	USHA SINGHAL	\N	\N	3	\N	251	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.404278	2026-07-03 21:19:25.404278	t	2014-09-30	f	\N	R23/8409	\N	\N	C-2	3/NA	2014-09-30	f
538	R23/8412	ALOK KUMAR JAISWAL	\N	\N	3	\N	252	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.407105	2026-07-03 21:19:25.407105	t	2016-05-24	f	\N	R23/8412	BIRENDRA BAHADUR JAISWAL	252	C-2	3/NA	2016-05-24	f
539	R23/8413	MURLIDHAR	XXXX-XX-0896	\N	3	\N	253	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.409734	2026-07-03 21:19:25.409734	t	2017-06-17	f	\N	R23/8413	PRATAP SINGH	253	C-2	3/NA	2017-06-17	f
540	R23/8414	RITU MISHRA	XXXX-XX-6792	\N	3	\N	254	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.412547	2026-07-03 21:19:25.412547	t	2018-06-23	f	\N	R23/8414	NAVNEET MISHRA	\N	C-2	3/NA	2018-06-23	f
541	R23/8386	DEVENDRA SINGH YADAV	XXXX-XX-4849	\N	3	\N	257	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.41559	2026-07-03 21:19:25.41559	t	2023-02-20	f	\N	R23/8386	RAMMURTI SINGH YADAV	257	C-2	3/NA	2023-02-20	f
542	R23/5322	MANJARI GANGAWAR	XXXX-XX-1132	\N	3	\N	258	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.418389	2026-07-03 21:19:25.418389	f	\N	f	\N	R23/5322	\N	\N	C-2	3/NA	\N	f
543	R23/4223	VIPIN KUMAR AGARWAL	\N	\N	3	\N	259	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.421132	2026-07-03 21:19:25.421132	t	2024-11-12	f	\N	R23/4223	MAHABIR PRASAD	259	C-2	3/NA	2024-11-12	f
545	R23/8798	USHA GANGWAR	XXXX-XX-7777	\N	3	\N	260	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.426755	2026-07-03 21:19:25.426755	t	2023-03-25	f	\N	R23/8798	PATIAM	\N	C-2	3/NA	2023-03-25	f
546	R23/9295	RAVI YADAV	XXXX-XX-1472	\N	3	\N	261	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.429516	2026-07-03 21:19:25.429516	t	2025-04-25	f	\N	R23/9295	RAMESH PAL SINGH	\N	C-2	3/NA	2025-04-25	f
547	R23/4258	BRIJESH KUMAR	XXXX-XX-4275	\N	3	\N	262	\N	residential	1381.50	\N	\N	t	2026-07-03 21:19:25.432644	2026-07-03 21:19:25.432644	t	2025-02-13	f	\N	R23/4258	HARBANSH KUMAR	262	C-2	3/NA	2025-02-13	f
548	R23/5068	RENU SHARMA	\N	\N	3	\N	264	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.436084	2026-07-03 21:19:25.436084	f	\N	f	\N	R23/5068	\N	264	C-2	3/NA	\N	f
549	R23/7293	BALRAM KRISHNA JAHORI	\N	\N	3	\N	265	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.438742	2026-07-03 21:19:25.438742	t	2008-10-06	f	\N	R23/7293	JAGDISH SARAN JAHORI	\N	C-2	3/NA	2008-10-06	f
550	R23/7294	PRADEEP KUMAR	XXXX-XX-4121	\N	3	\N	266	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.44145	2026-07-03 21:19:25.44145	t	2022-05-06	f	\N	R23/7294	MADAN LAL	\N	C-2	3/NA	2022-05-06	f
551	R23/6960	SATVENDRA KAUR	\N	\N	3	\N	267	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.444336	2026-07-03 21:19:25.444336	f	\N	f	\N	R23/6960	NARENDRA	\N	C-2	3/NA	\N	f
552	R23/7295	NISHA SINGH	\N	\N	3	\N	268	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.44739	2026-07-03 21:19:25.44739	t	2010-05-28	f	\N	R23/7295	SATENDRA KUMAR	\N	C-2	3/N.A.	2010-05-28	f
553	R23/7296	SAURABH KUMAR GANGWAR	\N	\N	3	\N	269	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.450227	2026-07-03 21:19:25.450227	t	2022-04-26	f	\N	R23/7296	DHEERENDRA	\N	C-2	3/NA	2022-04-26	f
554	R23/7093	SHIV MOHAN BHARTIYA	XXXX-XX-6958	\N	3	\N	26A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.45301	2026-07-03 21:19:25.45301	t	2018-05-31	f	\N	R23/7093	JUGDEO	\N	C-2	3/NA	2018-05-31	f
555	R23/7094	ANJANA GUPTA	XXXX-XX-6857	\N	3	\N	26B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.458	2026-07-03 21:19:25.458	t	2019-09-30	f	\N	R23/7094	\N	\N	C-2	3/NA	2019-09-30	f
556	R23/7351	GULSHAN GANGWAR	XXXX-XX-4646	\N	3	\N	27	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.461115	2026-07-03 21:19:25.461115	t	2023-06-22	f	\N	R23/7351	BHAJAN LAL	\N	C-2	3/NA	2023-06-22	f
557	R23/7297	RAJESH KUMAR AGARWAL	\N	\N	3	\N	270	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.463822	2026-07-03 21:19:25.463822	t	2008-05-28	f	\N	R23/7297	RAM KUMAR	\N	C-2	3/NA	2008-05-28	f
558	R23/7298	MANJU GOYALL	\N	\N	3	\N	271	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.466693	2026-07-03 21:19:25.466693	t	2008-09-19	f	\N	R23/7298	\N	\N	C-2	3/NA	2008-09-19	f
559	R23/7299	LAKHAN LAL AHIKHAR	\N	\N	3	\N	272	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.469589	2026-07-03 21:19:25.469589	t	2007-12-10	f	\N	R23/7299	RAM SAHAY AHIKHAR	\N	C-2	3/NA	2007-12-10	f
560	R23/9473	SHEELA	\N	\N	3	\N	273	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.472374	2026-07-03 21:19:25.472374	t	2008-09-09	f	\N	R23/9473	SATYA PRAKAS	\N	C-2	3/NA	2008-09-09	f
561	R23/7300	ANUP KISHORE	\N	\N	3	\N	274	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.475187	2026-07-03 21:19:25.475187	t	2014-04-11	f	\N	R23/7300	BRAHMA SWARUP SAXENA	\N	C-2	3/NA	2014-04-11	f
562	R23/7301	KUMARI BHUMILA GUPTA	\N	\N	3	\N	275	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.478059	2026-07-03 21:19:25.478059	t	2008-12-28	f	\N	R23/7301	\N	\N	C-2	3/NA	2008-12-28	f
563	R23/4030	HARPREET KAUR	\N	\N	3	\N	276	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.481765	2026-07-03 21:19:25.481765	t	2023-12-29	f	\N	R23/4030	INDERJEET SINGH	276	C-2	3/NA	2023-12-29	f
564	R23/8803	JITENDRA SINGH	\N	\N	3	\N	278	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.485196	2026-07-03 21:19:25.485196	t	2008-10-04	f	\N	R23/8803	INDESH KUMAR	\N	C-2	3/NA	2008-10-04	f
565	R23/7302	SARLA CHANDRA	\N	\N	3	\N	279	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.48795	2026-07-03 21:19:25.48795	t	2008-12-30	f	\N	R23/7302	\N	\N	C-2	3/NA	2008-12-30	f
566	R23/6800	SONAL RANI	XXXX-XX-2237	\N	3	\N	28	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.4907	2026-07-03 21:19:25.4907	f	\N	f	\N	R23/6800	CHOKEY LAL	\N	C-2	3/NA	\N	f
567	R23/7303	SANJEEV AGARWAL	\N	\N	3	\N	280	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.494079	2026-07-03 21:19:25.494079	t	2011-07-13	f	\N	R23/7303	GANGA PRASAD AGARWAL	\N	C-2	3/N.A.	2011-07-13	f
568	R23/7304	DURGESH KUMAR	\N	\N	3	\N	281	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.496775	2026-07-03 21:19:25.496775	t	2008-10-17	f	\N	R23/7304	RAKESH AGARWAL	\N	C-2	3/NA	2008-10-17	f
569	R23/7305	VIVEK AGARWAL	\N	\N	3	\N	282	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.4997	2026-07-03 21:19:25.4997	t	2017-11-21	f	\N	R23/7305	\N	\N	C-2	3/NA	2017-11-21	f
570	R23/6959	SHIVANI JAUHARI	\N	\N	3	\N	282A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.502304	2026-07-03 21:19:25.502304	t	2025-03-29	f	\N	R23/6959	\N	\N	C-2	3/NA	2025-03-29	f
571	R23/7306	SUDHIR KUMAR MATHUR	\N	\N	3	\N	283	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.50507	2026-07-03 21:19:25.50507	t	2019-07-17	f	\N	R23/7306	MADAN GOPAL MATHUR	\N	C-2	3/NA	2019-07-17	f
572	R23/6955	DHARMENRA KUMAR GUPTA	\N	\N	3	\N	284	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.507704	2026-07-03 21:19:25.507704	f	\N	f	\N	R23/6955	\N	\N	C-2	3/NA	\N	f
573	R23/6954	RAHUL KUMAR	\N	\N	3	\N	285	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.510427	2026-07-03 21:19:25.510427	f	\N	f	\N	R23/6954	KRISHNA KUMAR	\N	C-2	3/NA	\N	f
574	R23/6951	KIRAN YADAV	XXXX-XX-4589	\N	3	\N	286	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.513704	2026-07-03 21:19:25.513704	t	2025-05-28	f	\N	R23/6951	\N	\N	C-2	3/NA	2025-05-28	f
575	R23/6950	SHIKHA JAUHARI	XXXX-XX-8721	\N	3	\N	287	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.516525	2026-07-03 21:19:25.516525	f	\N	f	\N	R23/6950	HIMANSHU JAUHARI	\N	C-2	3/NA	\N	f
576	R23/6948	PRAVESH KUMAR	XXXX-XX-7471	\N	3	\N	288	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.519321	2026-07-03 21:19:25.519321	t	2025-05-28	f	\N	R23/6948	DEVENDRA KUMAR	\N	C-2	3/NA	2025-05-28	f
577	R23/8799	RAJESH KUMAR	XXXX-XX-5519	\N	3	\N	289	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.52207	2026-07-03 21:19:25.52207	t	2023-03-27	f	\N	R23/8799	CHANDRA PAL SINGH	\N	C-2	3/NA	2023-03-27	f
578	R23/6801	MUKESH KUMAR SINGHAL	XXXX-XX-8575	\N	3	\N	29	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.524984	2026-07-03 21:19:25.524984	t	2024-08-13	f	\N	R23/6801	INDRA SWAROOP	\N	C-2	3/NA	2024-08-13	f
579	R23/8789	BIJNESH KUMARI	XXXX-XX-9391	\N	3	\N	290	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.528458	2026-07-03 21:19:25.528458	t	2023-09-16	f	\N	R23/8789	MUKESH KUMAR	\N	C-2	3/NA	2023-09-16	f
580	R23/6896	VIKAS VEER	XXXX-XX-6126	\N	3	\N	291	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.531648	2026-07-03 21:19:25.531648	f	\N	f	\N	R23/6896	PRATAP KUMAR	\N	C-2	3/NA	\N	f
581	R23/2815	GARIMA KAPOOR	XXXX-XX-5848	\N	3	\N	292	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.534496	2026-07-03 21:19:25.534496	t	2023-11-29	f	\N	R23/2815	\N	292	C-2	3/NA	2023-11-29	f
582	R23/4287	AKASH MISHRA	XXXX-XX-9898	\N	3	\N	292A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.53735	2026-07-03 21:19:25.53735	t	2025-05-07	f	\N	R23/4287	ANIL KUMAR MISHRA	292A	C-2	3/NA	2025-05-07	f
583	R23/4290	SALMAN KHAN	XXXX-XX-6273	\N	3	\N	292B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.54021	2026-07-03 21:19:25.54021	t	2024-08-24	f	\N	R23/4290	USMAN KHAN	292B	C-2	3/NA	2024-08-24	f
584	R23/4303	OMENDRA SINGH	XXXX-XX-3355	\N	3	\N	292C	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.542952	2026-07-03 21:19:25.542952	f	\N	f	\N	R23/4303	LEELA SINGH	292C	C-2	3/NA	\N	f
585	R23/2816	RAM AUTAR	XXXX-XX-5273	\N	3	\N	293	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.545753	2026-07-03 21:19:25.545753	t	2025-01-30	f	\N	R23/2816	\N	293	C-2	3/NA	2025-01-30	f
586	R23/10716	Vacant	\N	\N	3	\N	293A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.548655	2026-07-03 21:19:25.548655	f	\N	f	\N	R23/10716	\N	293A	C-2	3/NA	\N	f
587	R23/10717	Vacant	\N	\N	3	\N	293B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.55142	2026-07-03 21:19:25.55142	f	\N	f	\N	R23/10717	\N	293B	C-2	3/--Select--	\N	f
588	R23/10718	Vacant	\N	\N	3	\N	293C	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.554049	2026-07-03 21:19:25.554049	f	\N	f	\N	R23/10718	\N	293C	C-2	3/--Select--	\N	f
589	R23/4311	SANJAY AGRAWAL	XXXX-XX-9968	\N	3	\N	293C	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.556616	2026-07-03 21:19:25.556616	f	\N	f	\N	R23/4311	SHIV KUMAR AGRAWAL	327A	C-2	3/NA	\N	f
590	R23/10719	Vacant	\N	\N	3	\N	293D	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.559372	2026-07-03 21:19:25.559372	f	\N	f	\N	R23/10719	\N	293D	C-2	3/NA	\N	f
591	R23/3204	INDRA JEET	XXXX-XX-3678	\N	3	\N	294	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.56212	2026-07-03 21:19:25.56212	t	2023-11-09	f	\N	R23/3204	REET RAM	294	C-2	3/NA	2023-11-09	f
592	R23/7308	ADWAIT KUMAR SHARMA	XXXX-XX-8256	\N	3	\N	295	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.564804	2026-07-03 21:19:25.564804	t	2022-02-26	f	\N	R23/7308	BDRIJENDRA SINGH YADAV	\N	C-2	3/NA	2022-02-26	f
593	R23/7309	HIMANSHU KHANDUJA	XXXX-XX-9155	\N	3	\N	296	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.567463	2026-07-03 21:19:25.567463	t	2022-08-05	f	\N	R23/7309	ROSHAN LAL KHANDUJA	\N	C-2	3/NA	2022-08-05	f
594	R23/3140	SARVESH KUMAR GANGWAR	XXXX-XX-2869	\N	3	\N	297	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.57085	2026-07-03 21:19:25.57085	t	2023-09-23	f	\N	R23/3140	SHIV SHANKER LAL GANGWAR	297	C-2	3/N.A.	2023-09-23	f
595	R23/4951	KAVITA TIWARI	\N	\N	3	\N	298	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.573465	2026-07-03 21:19:25.573465	t	2024-04-27	f	\N	R23/4951	\N	298	C-2	3/NA	2024-04-27	f
596	R23/2818	RUDRAKSH SAGAR	XXXX-XX-3195	\N	3	\N	299	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.576246	2026-07-03 21:19:25.576246	f	\N	f	\N	R23/2818	\N	299	C-2	3/NA	\N	f
597	R23/7068	RAJEEV UPADHYAYA	XXXX-XX-6150	\N	3	\N	3	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.578964	2026-07-03 21:19:25.578964	t	2020-12-29	f	\N	R23/7068	J P UPADHYAYA	\N	C-2	3/NA	2020-12-29	f
598	R23/8824	PRITHAVI SINGH	\N	\N	3	\N	30	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.581662	2026-07-03 21:19:25.581662	t	2023-05-06	f	\N	R23/8824	DEV KARAN	\N	C-2	3/NA	2023-05-06	f
599	R23/2837	MOHD ARIF	XXXX-XX-8362	\N	3	\N	300	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.584446	2026-07-03 21:19:25.584446	t	2023-11-23	f	\N	R23/2837	\N	300	C-2	3/NA	2023-11-23	f
600	R23/6895	GYAN SINGH	XXXX-XX-3845	\N	3	\N	301	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.587201	2026-07-03 21:19:25.587201	f	\N	f	\N	R23/6895	MEWA RAM	\N	C-2	3/NA	\N	f
601	R23/5007	YASHASWANI KAUSHAL	XXXX-XX-7888	\N	3	\N	302	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.590408	2026-07-03 21:19:25.590408	f	\N	f	\N	R23/5007	SANJEEV KAUSHAL	302	C-2	3/N.A.	\N	f
602	R23/6201	KUSHAL PAL	XXXX-XX-2551	\N	3	\N	303	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.593391	2026-07-03 21:19:25.593391	t	2024-08-21	f	\N	R23/6201	SUMER LAL	\N	C-2	3/NA	2024-08-21	f
603	R23/2819	NAVNEET YADAV	XXXX-XX-4891	\N	3	\N	304	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.59615	2026-07-03 21:19:25.59615	t	2024-12-13	f	\N	R23/2819	\N	304	C-2	3/NA	2024-12-13	f
604	R23/4304	PRADEEP KUMAR SINGH	XXXX-XX-9191	\N	3	\N	304A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.599247	2026-07-03 21:19:25.599247	f	\N	f	\N	R23/4304	RAJESHWAR SINGH	304A	C-2	3/NA	\N	f
605	R23/6893	ASHISH KUMAR GUPTA	XXXX-XX-8303	\N	3	\N	305	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.602075	2026-07-03 21:19:25.602075	t	2025-04-24	f	\N	R23/6893	\N	\N	C-2	3/NA	2025-04-24	f
606	R23/4952	SANJAY KUMAR	\N	\N	3	\N	306	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.605092	2026-07-03 21:19:25.605092	t	2024-04-27	f	\N	R23/4952	KASHI RAM	306	C-2	3/NA	2024-04-27	f
607	R23/4168	ALKA GANGWAR	\N	\N	3	\N	307	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.607625	2026-07-03 21:19:25.607625	f	\N	f	\N	R23/4168	RAM SEVAK SINGH	307	C-2	3/NA	\N	f
608	R23/7310	SANJEEV KUMAR PAL	XXXX-XX-1034	\N	3	\N	308	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.610389	2026-07-03 21:19:25.610389	t	2022-07-23	f	\N	R23/7310	RAGHWENDRA SINGH PAL	\N	C-2	3/NA	2022-07-23	f
609	R23/6892	PRATIKSHA PAL	XXXX-XX-0927	\N	3	\N	309	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.613886	2026-07-03 21:19:25.613886	t	2025-03-29	f	\N	R23/6892	KRISHNA PAL SINGH	\N	C-2	3/NA	2025-03-29	f
610	R23/8811	GAUTAM SNGH	XXXX-XX-6116	\N	3	\N	31	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.6174	2026-07-03 21:19:25.6174	t	2021-09-14	f	\N	R23/8811	M K SINGH	\N	C-2	3/NA	2021-09-14	f
611	R23/7398	SHARDHA SINGH	XXXX-XX-2017	\N	3	\N	310	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.620204	2026-07-03 21:19:25.620204	t	2023-11-18	f	\N	R23/7398	\N	\N	C-2	3/N.A.	2023-11-18	f
612	R23/3175	NEETU DEVI	XXXX-XX-2044	\N	3	\N	311	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.622911	2026-07-03 21:19:25.622911	t	2023-06-22	f	\N	R23/3175	SHAYAMVEER SINGH	311	C-2	3/NA	2023-06-22	f
613	R23/4436	KIRAN KUMARI	XXXX-XX-1713	\N	3	\N	312	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.625532	2026-07-03 21:19:25.625532	t	2024-06-17	f	\N	R23/4436	\N	312	C-2	3/NA	2024-06-17	f
614	R23/8864	RAMCHANDRA VERMA	XXXX-XX-2868	\N	3	\N	313	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.628258	2026-07-03 21:19:25.628258	t	2025-04-04	f	\N	R23/8864	RAM LAL	\N	C-2	3/NA	2025-04-04	f
615	R23/6891	RAMSRI	XXXX-XX-2265	\N	3	\N	314	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.631924	2026-07-03 21:19:25.631924	f	\N	f	\N	R23/6891	\N	\N	C-2	3/NA	\N	f
616	R23/2822	MUKESH GANGWAR	XXXX-XX-3039	\N	3	\N	315	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.635049	2026-07-03 21:19:25.635049	t	2024-10-09	f	\N	R23/2822	\N	315	C-2	3/NA	2024-10-09	f
618	R23/2824	PRADEEP KUMAR	XXXX-XX-5909	\N	3	\N	316	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.642712	2026-07-03 21:19:25.642712	t	2025-06-13	f	\N	R23/2824	\N	316	C-2	3/NA	2025-06-13	f
619	R23/4309	PREM LATA	XXXX-XX-6294	\N	3	\N	316A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.645561	2026-07-03 21:19:25.645561	t	2024-12-12	f	\N	R23/4309	\N	316A	C-2	3/NA	2024-12-12	f
620	R23/7311	MUNEESH KUMAR, REENA DEVI	XXXX-XX-9044	\N	3	\N	317	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.648163	2026-07-03 21:19:25.648163	t	2022-10-17	f	\N	R23/7311	\N	\N	C-2	3/NA	2022-10-17	f
621	R23/2827	RENU DEVI	XXXX-XX-3544	\N	3	\N	318	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.650931	2026-07-03 21:19:25.650931	t	2024-05-16	f	\N	R23/2827	\N	318	C-2	3/NA	2024-05-16	f
622	R23/6890	SHASHI BALA	XXXX-XX-4160	\N	3	\N	319	\N	residential	3190.00	\N	\N	t	2026-07-03 21:19:25.653791	2026-07-03 21:19:25.653791	f	\N	f	\N	R23/6890	\N	\N	C-2	3/NA	\N	f
623	R23/7097	RAMESH CHANDDRA GUPTA	\N	\N	3	\N	32	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.656354	2026-07-03 21:19:25.656354	t	2021-10-27	f	\N	R23/7097	CHIMMAN LAL GUPTA	\N	C-2	3/NA	2021-10-27	f
624	R23/7401	JAYA DWIVEDI	XXXX-XX-3913	\N	3	\N	320	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.659745	2026-07-03 21:19:25.659745	t	2023-07-15	f	\N	R23/7401	\N	\N	C-2	3/NA	2023-07-15	f
625	R23/6952	SWATI AGARWAL, ALOK KUMAR AGARWAL	XXXX-XX-0000	\N	3	\N	321	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.662377	2026-07-03 21:19:25.662377	f	\N	f	\N	R23/6952	\N	\N	C-2	3/NA	\N	f
626	R23/4188	SATISH KUMAR SHARMA	XXXX-XX-3591	\N	3	\N	322	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.665134	2026-07-03 21:19:25.665134	t	2024-03-02	f	\N	R23/4188	RAMESHWAR PRASAD SHARMA	322	C-2	3/NA	2024-03-02	f
627	R23/7406	ARJUN KUMAR	XXXX-XX-1890	\N	3	\N	323	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.667891	2026-07-03 21:19:25.667891	t	2023-03-31	f	\N	R23/7406	RAM KRISHNA	\N	C-2	3/NA	2023-03-31	f
628	R23/6953	YOGENDRA SINGH	XXXX-XX-6130	\N	3	\N	324	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.670828	2026-07-03 21:19:25.670828	f	\N	f	\N	R23/6953	LEKHRAJ	\N	C-2	3/NA	\N	f
629	R23/7425	MANU VAIPAYEE	XXXX-XX-4217	\N	3	\N	325	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.67345	2026-07-03 21:19:25.67345	t	2023-09-23	f	\N	R23/7425	\N	\N	C-2	3/NA	2023-09-23	f
630	R23/7400	SONI	XXXX-XX-0277	\N	3	\N	326	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.676447	2026-07-03 21:19:25.676447	t	2023-06-21	f	\N	R23/7400	\N	\N	C-2	3/NA	2023-06-21	f
631	R23/7334	ANITA DEVI	XXXX-XX-0259	\N	3	\N	327	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.679093	2026-07-03 21:19:25.679093	t	2023-06-21	f	\N	R23/7334	\N	\N	C-2	3/NA	2023-06-21	f
617	R23/4307	KAMNA	XXXX-XX-9704	\N	3	\N	315A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.639851	2026-07-03 21:19:25.639851	f	\N	f	\N	R23/4307	\N	315A	C-2	3/NA	\N	f
632	R23/4260	MAHIMA SAXENA	XXXX-XX-8776	\N	3	\N	328	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.682077	2026-07-03 21:19:25.682077	f	\N	f	\N	R23/4260	ANKIT KANCHAN	328	C-2	3/NA	\N	f
633	R23/4262	RAJ KUMAR BHASIN	XXXX-XX-5771	\N	3	\N	329	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.684704	2026-07-03 21:19:25.684704	f	\N	f	\N	R23/4262	LATE TILAK RAJ BHASIN	329	C-2	3/NA	\N	f
635	R23/4263	SHALINI AGARWAL	XXXX-XX-0129	\N	3	\N	330	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.690167	2026-07-03 21:19:25.690167	f	\N	f	\N	R23/4263	MAHENDRA KUMAR AGARWAL	330	C-2	3/NA	\N	f
636	R23/4264	SACHIN SINGH RATHORE	XXXX-XX-5003	\N	3	\N	331	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.692863	2026-07-03 21:19:25.692863	t	2024-12-28	f	\N	R23/4264	NARESH PAL SINGH RATHORE	331	C-2	3/NA	2024-12-28	f
637	R23/4265	SHIVAM KUMAR	XXXX-XX-4579	\N	3	\N	332	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.69518	2026-07-03 21:19:25.69518	f	\N	f	\N	R23/4265	RAKESH KUMAR	332	C-2	3/N.A.	\N	f
638	R23/4266	JAISHREE AGARWAL	XXXX-XX-1982	\N	3	\N	333	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.698103	2026-07-03 21:19:25.698103	f	\N	f	\N	R23/4266	\N	333	C-2	3/NA	\N	f
639	R23/4267	VIVEK KUMAR	XXXX-XX-2778	\N	3	\N	334	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.70174	2026-07-03 21:19:25.70174	f	\N	f	\N	R23/4267	PRAKASH CHANDRA SAXENA	334	C-2	3/NA	\N	f
640	R23/4269	SEETA MAURYA	XXXX-XX-1492	\N	3	\N	335	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.704758	2026-07-03 21:19:25.704758	f	\N	f	\N	R23/4269	\N	335	C-2	3/NA	\N	f
641	R23/4271	PRABHAT KUMAR	XXXX-XX-3435	\N	3	\N	336	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.707787	2026-07-03 21:19:25.707787	f	\N	f	\N	R23/4271	NARESH KUMAR	336	C-2	3/NA	\N	f
642	R23/4274	SUHIT AGARWAL	XXXX-XX-1289	\N	3	\N	337	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.710576	2026-07-03 21:19:25.710576	f	\N	f	\N	R23/4274	DINESH KUMAR AGARWAL	337	C-2	3/NA	\N	f
643	R23/4278	SAKSHI GUPTA	XXXX-XX-1569	\N	3	\N	338	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.713253	2026-07-03 21:19:25.713253	f	\N	f	\N	R23/4278	\N	338	C-2	3/NA	\N	f
644	R23/4314	SARVESH KUMAR GANGWAR	XXXX-XX-5571	\N	3	\N	338A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.716132	2026-07-03 21:19:25.716132	t	2025-06-25	f	\N	R23/4314	DEVENDRA PAL SINGH	338A	C-2	3/NA	2025-06-25	f
645	R23/4316	AMIT KUMAR SHARMA	XXXX-XX-0088	\N	3	\N	338B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.718832	2026-07-03 21:19:25.718832	f	\N	f	\N	R23/4316	SATISH CHANDRA SHARMA	338B	C-2	3/NA	\N	f
646	R23/4317	SAKSHI SHARMA	XXXX-XX-9046	\N	3	\N	338C	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.722037	2026-07-03 21:19:25.722037	f	\N	f	\N	R23/4317	\N	338C	C-2	3/NA	\N	f
647	R23/4318	RAHUL KUMAR	XXXX-XX-0491	\N	3	\N	338D	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.724816	2026-07-03 21:19:25.724816	t	2025-03-07	f	\N	R23/4318	GRISH KUMAR	338D	C-2	3/NA	2025-03-07	f
648	R23/4323	AJAY KUMAR SINGH	XXXX-XX-8496	\N	3	\N	338E	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.727783	2026-07-03 21:19:25.727783	t	2025-05-29	f	\N	R23/4323	CHANDRA PAL SINGH	338E	C-2	3/NA	2025-05-29	f
649	R23/4324	BHOOP RAM	XXXX-XX-5162	\N	3	\N	338F	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.730486	2026-07-03 21:19:25.730486	f	\N	f	\N	R23/4324	SHRI JANKI PRASAD	338F	C-2	3/NA	\N	f
650	R23/4335	SURESH KUMAR	XXXX-XX-5021	\N	3	\N	338G	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.733171	2026-07-03 21:19:25.733171	f	\N	f	\N	R23/4335	LATE RAJA RAM	338G	C-2	3/NA	\N	f
651	R23/4377	VEENA SINGH & VIJAY SINGH	XXXX-XX-7714	\N	3	\N	338H	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.735803	2026-07-03 21:19:25.735803	t	2025-05-28	f	\N	R23/4377	VIJAY SINGH &amp; LATE SRI MATHURI LAL	338H	C-2	3/NA	2025-05-28	f
652	R23/4280	NARESH CHANDRA	XXXX-XX-5227	\N	3	\N	339	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.740148	2026-07-03 21:19:25.740148	t	2024-04-16	f	\N	R23/4280	KHYALI RAM	339	C-2	3/NA	2024-04-16	f
653	R23/6803	RAM DUTT PALIWAR	XXXX-XX-8528	\N	3	\N	34	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.74292	2026-07-03 21:19:25.74292	f	\N	f	\N	R23/6803	BACHI DUTT	\N	C-2	3/NA	\N	f
654	R23/8815	KAPIL ARORA	XXXX-XX-1442	\N	3	\N	340	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.745736	2026-07-03 21:19:25.745736	t	2022-03-11	f	\N	R23/8815	PAWAN KUMAR ARORA	\N	C-2	3/NA	2022-03-11	f
655	R23/7312	POONAM KASHYAP	XXXX-XX-7732	\N	3	\N	341	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.749105	2026-07-03 21:19:25.749105	t	2020-12-15	f	\N	R23/7312	\N	\N	C-2	3/NA	2020-12-15	f
656	R23/7314	RAJNISH KUMAR	XXXX-XX-1654	\N	3	\N	342	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.752185	2026-07-03 21:19:25.752185	t	2021-04-09	f	\N	R23/7314	RAM AVTAR	\N	C-2	3/NA	2021-04-09	f
657	R23/6886	SUNEEL KUMAR	XXXX-XX-8328	\N	3	\N	343	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.754597	2026-07-03 21:19:25.754597	t	2025-06-13	f	\N	R23/6886	RAJENDRA KUMAR GUPTA	\N	C-2	3/NA	2025-06-13	f
658	R23/6884	KUMAR VIKRANT	XXXX-XX-9169	\N	3	\N	344	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.757702	2026-07-03 21:19:25.757702	f	\N	f	\N	R23/6884	SURENDRA RATAN SINHA	\N	C-2	3/NA	\N	f
659	R23/5088	RATNESH CHANDRA	XXXX-XX-5855	\N	3	\N	345	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.760242	2026-07-03 21:19:25.760242	t	2025-01-30	f	\N	R23/5088	\N	345	C-2	3/NA	2025-01-30	f
660	R23/6880	SURENDRA PAL GANGWAR	XXXX-XX-1134	\N	3	\N	346	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.763084	2026-07-03 21:19:25.763084	f	\N	f	\N	R23/6880	PRAN SUKH GANGWAR	\N	C-2	3/NA	\N	f
661	R23/7335	DHIRENRA KUMAR	XXXX-XX-8538	\N	3	\N	347	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.765835	2026-07-03 21:19:25.765835	t	2023-03-25	f	\N	R23/7335	SUNDER LAL	\N	C-2	3/NA	2023-03-25	f
662	R23/7315	BHANWATI	\N	\N	3	\N	348	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.768679	2026-07-03 21:19:25.768679	t	2021-07-27	f	\N	R23/7315	\N	\N	C-2	3/NA	2021-07-27	f
663	R23/3347	ARUN KUMAR GAUTAM	XXXX-XX-8962	\N	3	\N	349	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.77164	2026-07-03 21:19:25.77164	t	2023-11-20	f	\N	R23/3347	MAHENDRA PAL SINGH	349	C-2	3/NA	2023-11-20	f
664	R23/7098	URMILA TANDON	XXXX-XX-8212	\N	3	\N	35	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.774264	2026-07-03 21:19:25.774264	t	2022-04-08	f	\N	R23/7098	\N	\N	C-2	3/NA	2022-04-08	f
665	R23/7317	SANJAY KUMAR	XXXX-XX-3724	\N	3	\N	350	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.776807	2026-07-03 21:19:25.776807	t	2021-02-09	f	\N	R23/7317	SUNDER LAL	\N	C-2	3/NA	2021-02-09	f
666	R23/3225	DINESH KUMAR GANGWAR	XXXX-XX-6664	\N	3	\N	351	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.779381	2026-07-03 21:19:25.779381	f	\N	f	\N	R23/3225	RAJENDRA PRASAD GANGWAR	351	C-2	3/NA	\N	f
667	R23/9472	ARCHNA	XXXX-XX-5588	\N	3	\N	352	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.781695	2026-07-03 21:19:25.781695	t	2024-02-02	f	\N	R23/9472	SACHIN KUMAR KASHYAP	\N	C-2	3/NA	2024-02-02	f
668	R23/7427	RAKESH KUMAR TRIPATHI	XXXX-XX-6384	\N	3	\N	353	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.784244	2026-07-03 21:19:25.784244	t	2023-10-21	f	\N	R23/7427	SATISH CHANDRA TRIPATHI	\N	C-2	3/NA	2023-10-21	f
669	R23/3177	MANJU SINGH	XXXX-XX-7291	\N	3	\N	354	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.786698	2026-07-03 21:19:25.786698	t	2023-10-21	f	\N	R23/3177	-	354	C-2	3/NA	2023-10-21	f
670	R23/7318	RAJAT ARORA	XXXX-XX-1447	\N	3	\N	355	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.789767	2026-07-03 21:19:25.789767	t	2021-12-02	f	\N	R23/7318	PAWAN KUMAR ARORA	\N	C-2	3/NA	2021-12-02	f
671	R23/3189	GAURI JAISWAL	XXXX-XX-0099	\N	3	\N	356	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.792729	2026-07-03 21:19:25.792729	f	\N	f	\N	R23/3189	\N	356	C-2	3/NA	\N	f
672	R23/7319	SUNEEL CHAURASIA	XXXX-XX-6555	\N	3	\N	357	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.796302	2026-07-03 21:19:25.796302	t	2022-09-26	f	\N	R23/7319	HARISH CHANDRA CHAURAIA	\N	C-2	3/NA	2022-09-26	f
673	R23/7407	MAMTA SINGH	XXXX-XX-5617	\N	3	\N	358	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.798731	2026-07-03 21:19:25.798731	t	2023-06-21	f	\N	R23/7407	\N	\N	C-2	3/NA	2023-06-21	f
674	R23/7337	VIVEK GUPTA	XXXX-XX-1617	\N	3	\N	359	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.801169	2026-07-03 21:19:25.801169	t	2023-05-30	f	\N	R23/7337	VINAY KUMAR GUPTA	\N	C-2	3/NA	2023-05-30	f
675	R23/7352	MANOJ KUMAR	XXXX-XX-4646	\N	3	\N	36	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.803759	2026-07-03 21:19:25.803759	t	2022-04-08	f	\N	R23/7352	BHAJAN LAL	\N	C-2	3/NA	2022-04-08	f
676	R23/7428	VINAY SINGH	XXXX-XX-1060	\N	3	\N	360	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.806247	2026-07-03 21:19:25.806247	t	2023-05-06	f	\N	R23/7428	SATISH CHANDRA	\N	C-2	3/NA	2023-05-06	f
677	R23/7339	PRIYANKA SHARMA	XXXX-XX-8427	\N	3	\N	361	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.808517	2026-07-03 21:19:25.808517	t	2023-11-29	f	\N	R23/7339	\N	\N	C-2	3/NA	2023-11-29	f
678	R23/7429	RAM SARAN	XXXX-XX-9247	\N	3	\N	362	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.811126	2026-07-03 21:19:25.811126	t	2024-04-15	f	\N	R23/7429	GOPI LAL	\N	C-2	3/NA	2024-04-15	f
679	R23/6879	AJEET KUMAR	XXXX-XX-0760	\N	3	\N	363	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.813999	2026-07-03 21:19:25.813999	t	2024-11-29	f	\N	R23/6879	CHANDAL KUMAR	\N	C-2	3/NA	2024-11-29	f
680	R23/6878	SHASHI TRIPATHI	XXXX-XX-8195	\N	3	\N	364	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.816824	2026-07-03 21:19:25.816824	t	2025-05-28	f	\N	R23/6878	AMIT TRIPATHI	\N	C-2	3/NA	2025-05-28	f
681	R23/5079	MANOJ KUMAR SINGH	XXXX-XX-3079	\N	3	\N	365	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.819538	2026-07-03 21:19:25.819538	f	\N	f	\N	R23/5079	BADRI PRASAD	365	C-2	3/NA	\N	f
682	R23/8859	ANIKET SINGH	XXXX-XX-1676	\N	3	\N	366	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.822024	2026-07-03 21:19:25.822024	t	2024-11-06	f	\N	R23/8859	DAYA RAM	\N	C-2	3/NA	2024-11-06	f
683	R23/7395	MUKTA KADAM	XXXX-XX-4160	\N	3	\N	367	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.824738	2026-07-03 21:19:25.824738	t	2024-03-02	f	\N	R23/7395	\N	\N	C-2	3/NA	2024-03-02	f
684	R23/6876	AKHILESH KUMAR UPADHYAYA	XXXX-XX-4206	\N	3	\N	368	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.827487	2026-07-03 21:19:25.827487	f	\N	f	\N	R23/6876	SHRINIWASH SHARMA	\N	C-2	3/NA	\N	f
685	R23/4942	SAURABH SINGH	\N	\N	3	\N	369	\N	residential	0.00	\N	\N	t	2026-07-03 21:19:25.830593	2026-07-03 21:19:25.830593	t	2024-06-05	f	\N	R23/4942	LAKHPAT SINGH	369	C-2	3/NA	2024-06-05	f
686	R23/7101	MANOJ KUMAR SHARMA	XXXX-XX-4164	\N	3	\N	37	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.833237	2026-07-03 21:19:25.833237	t	2021-06-18	f	\N	R23/7101	RADHE SHYAM SHARMA	\N	C-2	3/NA	2021-06-18	f
687	R23/6873	SHAKUNTALA	XXXX-XX-0457	\N	3	\N	370	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.835458	2026-07-03 21:19:25.835458	f	\N	f	\N	R23/6873	\N	\N	C-2	3/NA	\N	f
688	R23/6872	PARKHAR SUKLA	XXXX-XX-6958	\N	3	\N	371	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.838015	2026-07-03 21:19:25.838015	f	\N	f	\N	R23/6872	MANOJ SUKLA	\N	C-2	3/NA	\N	f
689	R23/8813	SATENDRA KUMAR PAL	XXXX-XX-2219	\N	3	\N	372	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.840544	2026-07-03 21:19:25.840544	t	2023-02-17	f	\N	R23/8813	DARBARI LAL PAL	\N	C-2	3/NA	2023-02-17	f
690	R23/4096	SHIPRA SINGH	XXXX-XX-0828	\N	3	\N	373	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.843087	2026-07-03 21:19:25.843087	t	2024-02-27	f	\N	R23/4096	SAUDAN SINGH	373	C-2	3/NA	2024-02-27	f
691	R23/6853	SUMMER LAL RATHORE	XXXX-XX-3214	\N	3	\N	374	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.845558	2026-07-03 21:19:25.845558	f	\N	f	\N	R23/6853	POTHIRAM RAHTORE	\N	C-2	3/NA	\N	f
692	R23/7342	PRACHI SAXENA	XXXX-XX-4410	\N	3	\N	375	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.848395	2026-07-03 21:19:25.848395	t	2023-12-13	f	\N	R23/7342	\N	\N	C-2	3/NA	2023-12-13	f
693	R23/6855	DEVKI RANI	XXXX-XX-0452	\N	3	\N	376	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.850887	2026-07-03 21:19:25.850887	f	\N	f	\N	R23/6855	\N	\N	C-2	3/NA	\N	f
694	R23/7344	GIRJA SHANKAR	XXXX-XX-1518	\N	3	\N	377	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.853664	2026-07-03 21:19:25.853664	t	2022-12-24	f	\N	R23/7344	HARDYAL SINGH	\N	C-2	3/NA	2022-12-24	f
695	R23/6856	VINOD KUMAR DWIVEDI	XXXX-XX-8263	\N	3	\N	378	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.856452	2026-07-03 21:19:25.856452	f	\N	f	\N	R23/6856	BISHWANATH DWIVEDI	\N	C-2	3/NA	\N	f
696	R23/7393	SHAILLY ARYA	XXXX-XX-8830	\N	3	\N	379	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.859328	2026-07-03 21:19:25.859328	t	2023-10-27	f	\N	R23/7393	NARESH KUMAR ARYA	\N	C-2	3/NA	2023-10-27	f
697	R23/7404	VIPIN KUMAR	XXXX-XX-0778	\N	3	\N	38	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.861622	2026-07-03 21:19:25.861622	t	2021-03-25	f	\N	R23/7404	VED PRAKASH	\N	C-2	3/NA	2021-03-25	f
698	R23/10765	AJAY TRIVEDI	\N	\N	3	\N	380	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.864235	2026-07-03 21:19:25.864235	t	2024-01-02	f	\N	R23/10765	SHANTI SWAROOP TRIVEDI	\N	C-2	3/NA	2024-01-02	f
699	R23/4013	SHAILENDRA GANGWAR	XXXX-XX-1905	\N	3	\N	381	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.86673	2026-07-03 21:19:25.86673	t	2024-01-03	f	\N	R23/4013	J P GANGWAR	381	C-2	3/NA	2024-01-03	f
700	R23/4084	MENENDRA KUMAR SAXENA	XXXX-XX-8979	\N	3	\N	382	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.86988	2026-07-03 21:19:25.86988	t	2024-03-02	f	\N	R23/4084	SUKHNANDHAN PRASAD SAXENA	382	C-2	3/NA	2024-03-02	f
701	R23/6858	SHALINI GUPTA	XXXX-XX-0890	\N	3	\N	383	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.872248	2026-07-03 21:19:25.872248	f	\N	f	\N	R23/6858	\N	\N	C-2	3/NA	\N	f
702	R23/6860	PRADEEP KUMAR SINGH YADAV	XXXX-XX-2274	\N	3	\N	384	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.874662	2026-07-03 21:19:25.874662	f	\N	f	\N	R23/6860	\N	\N	C-2	3/NA	\N	f
703	R23/8863	CHANDRA SHEKHAR	XXXX-XX-3363	\N	3	\N	386	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.877394	2026-07-03 21:19:25.877394	f	\N	f	\N	R23/8863	RADHEY SHYAM SHARMA	\N	C-2	3/NA	\N	f
704	R23/7103	MANJU CHAUDHARY	XXXX-XX-1138	\N	3	\N	39	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.880766	2026-07-03 21:19:25.880766	t	2021-03-10	f	\N	R23/7103	\N	\N	C-2	3/NA	2021-03-10	f
705	R23/6862	SUNITA KHUDRANA	XXXX-XX-8188	\N	3	\N	390	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.883451	2026-07-03 21:19:25.883451	t	2024-12-28	f	\N	R23/6862	\N	\N	C-2	3/NA	2024-12-28	f
706	R23/7320	SUNEETA	XXXX-XX-3746	\N	3	\N	392	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.886234	2026-07-03 21:19:25.886234	t	2023-03-16	f	\N	R23/7320	RAJKUAMR	\N	C-2	3/NA	2023-03-16	f
707	R23/8312	RAJ KUMAR SINGH	XXXX-XX-9555	\N	3	\N	393	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.88884	2026-07-03 21:19:25.88884	f	\N	f	\N	R23/8312	KHADUG SINGH	393	C-2	3/NA	\N	f
708	R23/8828	SUSHMA SINGH	XXXX-XX-8419	\N	3	\N	394	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.891264	2026-07-03 21:19:25.891264	t	2024-08-05	f	\N	R23/8828	\N	\N	C-2	3/NA	2024-08-05	f
709	R23/3141	AMIT KUMAR	XXXX-XX-9067	\N	3	\N	395	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.893772	2026-07-03 21:19:25.893772	t	2023-10-21	f	\N	R23/3141	INDAL BABU	395	C-2	3/N.A.	2023-10-21	f
710	R23/3193	RAVI KUMAR	XXXX-XX-3506	\N	3	\N	396	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.896506	2026-07-03 21:19:25.896506	t	2023-10-21	f	\N	R23/3193	SHRI RAM	396	C-2	3/N.A.	2023-10-21	f
711	R23/8861	YATENDRA KUMAR	XXXX-XX-1243	\N	3	\N	397	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.899256	2026-07-03 21:19:25.899256	f	\N	f	\N	R23/8861	LOKPAL SINGH	\N	C-2	3/NA	\N	f
712	R23/7392	DHANESWARI PAL	XXXX-XX-9696	\N	3	\N	398	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.902053	2026-07-03 21:19:25.902053	t	2023-07-22	f	\N	R23/7392	\N	\N	C-2	3/NA	2023-07-22	f
713	R23/6863	SEEMA RANI	XXXX-XX-9529	\N	3	\N	399	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.904837	2026-07-03 21:19:25.904837	f	\N	f	\N	R23/6863	\N	\N	C-2	3/NA	\N	f
714	R23/7070	DINESH CHANDRA AGARWAL	XXXX-XX-0608	\N	3	\N	4	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.907667	2026-07-03 21:19:25.907667	t	2018-08-04	f	\N	R23/7070	JAGDISH PRASAD AGARWAL	\N	C-2	3/NA	2018-08-04	f
715	R23/7104	ANJALI VERMA	XXXX-XX-3557	\N	3	\N	40	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.910312	2026-07-03 21:19:25.910312	t	2019-01-30	f	\N	R23/7104	\N	\N	C-2	3/NA	2019-01-30	f
716	R23/2371	SUKH DEVI	XXXX-XX-3389	\N	3	\N	400	\N	residential	1251.60	\N	\N	t	2026-07-03 21:19:25.913647	2026-07-03 21:19:25.913647	t	2023-09-02	f	\N	R23/2371	\N	400	C-2	3/NA	2023-09-02	f
717	R23/3190	SUSHMA YADAV	XXXX-XX-5357	\N	3	\N	401	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.916164	2026-07-03 21:19:25.916164	t	2024-03-02	f	\N	R23/3190	\N	401	C-2	3/NA	2024-03-02	f
718	R23/6864	AMIT GARG	XXXX-XX-8497	\N	3	\N	402	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.919111	2026-07-03 21:19:25.919111	f	\N	f	\N	R23/6864	\N	\N	C-2	3/NA	\N	f
719	R23/8387	RAGHUNATH SINGH	XXXX-XX-4268	\N	3	\N	403	\N	residential	2000.00	\N	\N	t	2026-07-03 21:19:25.921896	2026-07-03 21:19:25.921896	f	\N	f	\N	R23/8387	KUNDAN SINGH	403	C-2	3/NA	\N	f
720	R23/4075	MEENA TYAGI	XXXX-XX-4755	\N	3	\N	404	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.924479	2026-07-03 21:19:25.924479	f	\N	f	\N	R23/4075	APIL KUMAR TYAGI	404	C-2	3/NA	\N	f
721	R23/6865	KAMAL KUMAR SINGH	XXXX-XX-0721	\N	3	\N	405	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.927106	2026-07-03 21:19:25.927106	f	\N	f	\N	R23/6865	KHADAK SINGH	\N	C-2	3/NA	\N	f
722	R23/6867	RAM TIRATH SHARMA	XXXX-XX-1276	\N	3	\N	406	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.930035	2026-07-03 21:19:25.930035	t	2024-11-21	f	\N	R23/6867	BHAIYA LAL SHARMA	\N	C-2	3/NA	2024-11-21	f
723	R23/5216	VACANT	\N	\N	3	\N	407	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.932862	2026-07-03 21:19:25.932862	f	\N	f	\N	R23/5216	\N	407	C-2	3/N.A.	\N	f
724	R23/6868	PRAVAL PANT	XXXX-XX-2368	\N	3	\N	408	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.935511	2026-07-03 21:19:25.935511	t	2025-03-07	f	\N	R23/6868	BHUVAN CHANDRA PANT	\N	C-2	3/NA	2025-03-07	f
725	R23/5276	JAGPAL	XXXX-XX-8368	\N	3	\N	409	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.93813	2026-07-03 21:19:25.93813	f	\N	f	\N	R23/5276	NATTHU LAL	409	C-2	3/NA	\N	f
726	R23/7106	ROMA CHANDNA	XXXX-XX-0680	\N	3	\N	41	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.941053	2026-07-03 21:19:25.941053	t	2021-11-30	f	\N	R23/7106	\N	\N	C-2	3/NA	2021-11-30	f
727	R23/5319	ANHIT MISHRA	XXXX-XX-5098	\N	3	\N	410	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.943781	2026-07-03 21:19:25.943781	t	2024-06-05	f	\N	R23/5319	ANIL KUMAR MISHRA	\N	C-2	3/NA	2024-06-05	f
728	R23/7321	MAHENDRA PAL SINGH	XXXX-XX-6072	\N	3	\N	411	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.946405	2026-07-03 21:19:25.946405	t	2020-12-20	f	\N	R23/7321	DEVI DAS	\N	C-2	3/NA	2020-12-20	f
729	R23/8827	NEETU BHATNAGAR	XXXX-XX-1975	\N	3	\N	412	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.94907	2026-07-03 21:19:25.94907	t	2024-07-02	f	\N	R23/8827	\N	\N	C-2	3/NA	2024-07-02	f
730	R23/4070	RAM KUMAR	XXXX-XX-9639	\N	3	\N	413	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.951888	2026-07-03 21:19:25.951888	t	2024-03-05	f	\N	R23/4070	NATTHU LAL	413	C-2	3/NA	2024-03-05	f
731	R23/3232	RITY TYAGI	XXXX-XX-6654	\N	3	\N	414	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.955233	2026-07-03 21:19:25.955233	t	2023-10-27	f	\N	R23/3232	\N	414	C-2	3/NA	2023-10-27	f
732	R23/7328	SATISH CHANDRA	XXXX-XX-0883	\N	3	\N	415	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.95836	2026-07-03 21:19:25.95836	t	2023-10-21	f	\N	R23/7328	TEJ RAM	\N	C-2	3/NA	2023-10-21	f
733	R23/6869	RAKESH KUMAR GAUTAM	XXXX-XX-7627	\N	3	\N	416	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.961231	2026-07-03 21:19:25.961231	f	\N	f	\N	R23/6869	TIRATH RAJ	\N	C-2	3/NA	\N	f
734	R23/4055	RATI BHAN	XXXX-XX-0704	\N	3	\N	417	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.96392	2026-07-03 21:19:25.96392	t	2024-03-02	f	\N	R23/4055	MIHI LAL	417	C-2	3/NA	2024-03-02	f
736	R23/7329	AMIT SHARMA	XXXX-XX-4206	\N	3	\N	419	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.969822	2026-07-03 21:19:25.969822	t	2023-09-02	f	\N	R23/7329	DARSHAN KUMAR SHARMA	\N	C-2	3/NA	2023-09-02	f
737	R23/10755	MUKESH KUMAR AGARWAL	XXXX-XX-6514	\N	3	\N	42	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.972334	2026-07-03 21:19:25.972334	t	2017-11-21	f	\N	R23/10755	KHIDAGANJ	\N	C-2	3/NA	2017-11-21	f
738	R23/3212	PRAMOD KUAMR	XXXX-XX-5084	\N	3	\N	420	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.974947	2026-07-03 21:19:25.974947	t	2024-06-05	f	\N	R23/3212	SUMER LAL	420	C-2	3/NA	2024-06-05	f
739	R23/7332	ASHOK KUMAR KATARIA	XXXX-XX-9999	\N	3	\N	421	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.97764	2026-07-03 21:19:25.97764	t	2022-05-07	f	\N	R23/7332	RUMAL SINGH	\N	C-2	3/NA	2022-05-07	f
740	R23/8800	SAUDRABH KUMAR GANGWAR	XXXX-XX-9977	\N	3	\N	422	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.980264	2026-07-03 21:19:25.980264	t	2022-08-05	f	\N	R23/8800	PREM BABU	\N	C-2	3/NA	2022-08-05	f
741	R23/4097	VISHAKHA SINGH	XXXX-XX-7082	\N	3	\N	423	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.982747	2026-07-03 21:19:25.982747	t	2024-07-27	f	\N	R23/4097	\N	423	C-2	3/NA	2024-07-27	f
742	R23/6871	VISHAL PAL SINGH	XXXX-XX-6828	\N	3	\N	424	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.985587	2026-07-03 21:19:25.985587	t	2025-05-01	f	\N	R23/6871	BISHAN PAL SINGH	\N	C-2	3/NA	2025-05-01	f
743	R23/7322	MADHURI RANI SAXENA	\N	\N	3	\N	425	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.988612	2026-07-03 21:19:25.988612	t	2022-07-23	f	\N	R23/7322	\N	\N	C-2	3/NA	2022-07-23	f
744	R23/2828	G R VERMA	XXXX-XX-1490	\N	3	\N	426	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.991497	2026-07-03 21:19:25.991497	f	\N	f	\N	R23/2828	\N	426	C-2	3/NA	\N	f
745	R23/8400	RAJ KUMAR BHASEEN	XXXX-XX-6155	\N	3	\N	427	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.994129	2026-07-03 21:19:25.994129	f	\N	f	\N	R23/8400	S P GUPTA	427	C-2	3/NA	\N	f
746	R23/4234	GAURAV KUMAR	\N	\N	3	\N	428	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.997371	2026-07-03 21:19:25.997371	t	2024-05-28	f	\N	R23/4234	\N	428	C-2	3/NA	2024-05-28	f
747	R23/8860	VIMLESH KHANDELWAL	XXXX-XX-8912	\N	3	\N	429	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.999722	2026-07-03 21:19:25.999722	t	2025-03-07	f	\N	R23/8860	DINESH KHANDELWAL	\N	C-2	3/NA	2025-03-07	f
748	R23/2370	RACHNA GUPTA	XXXX-XX-7756	\N	3	\N	43	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.002791	2026-07-03 21:19:26.002791	t	2024-01-27	f	\N	R23/2370	\N	0	C-2	3/NA	2024-01-27	f
749	R23/6303	NEETU VERMA	XXXX-XX-1348	\N	3	\N	430	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.005121	2026-07-03 21:19:26.005121	t	2025-01-30	f	\N	R23/6303	\N	\N	C-2	3/NA	2025-01-30	f
750	R23/5168	GAYATRI MISHRA	XXXX-XX-4616	\N	3	\N	431	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.008052	2026-07-03 21:19:26.008052	f	\N	f	\N	R23/5168	\N	431	C-2	3/NA	\N	f
751	R23/4283	SHIKHA GANGWAR	XXXX-XX-8404	\N	3	\N	432	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.01079	2026-07-03 21:19:26.01079	t	2024-08-13	f	\N	R23/4283	\N	432	C-2	3/NA	2024-08-13	f
752	R23/7109	RAM SINGH	\N	\N	3	\N	44	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.013741	2026-07-03 21:19:26.013741	t	2013-12-12	f	\N	R23/7109	RAJENDRA BAHADUR SINGH	\N	C-2	3/NA	2013-12-12	f
753	R23/7111	MOOL CHAND SHARMA	XXXX-XX-0164	\N	3	\N	45	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.016543	2026-07-03 21:19:26.016543	t	2014-07-19	f	\N	R23/7111	\N	\N	C-2	3/NA	2014-07-19	f
754	R23/7112	UDAY NARAYAN SINGH	XXXX-XX-1883	\N	3	\N	46	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.019333	2026-07-03 21:19:26.019333	t	2022-06-30	f	\N	R23/7112	BIHRAMA DITYA RAI	\N	C-2	3/NA	2022-06-30	f
755	R23/7113	RAVI PRAKASH GUPTA	XXXX-XX-3728	\N	3	\N	47	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.021833	2026-07-03 21:19:26.021833	t	2022-12-17	f	\N	R23/7113	K B GUPTA	\N	C-2	3/NA	2022-12-17	f
756	R23/7116	SHYAM AGARWAL	XXXX-XX-1100	\N	3	\N	48	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.02451	2026-07-03 21:19:26.02451	t	2021-08-17	f	\N	R23/7116	MUNNI LAL AGARWAL	\N	C-2	3/NA	2021-08-17	f
757	R23/5065	VAIBHAV SHARMA	XXXX-XX-3058	\N	3	\N	49	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.027156	2026-07-03 21:19:26.027156	t	2025-02-13	f	\N	R23/5065	GHANSHYAM SHARMA	49	C-2	3/NA	2025-02-13	f
758	R23/7071	ATAUR RAHMAN	XXXX-XX-9773	\N	3	\N	5	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.029758	2026-07-03 21:19:26.029758	t	2009-06-04	f	\N	R23/7071	RAHMAN	\N	C-2	3/NA	2009-06-04	f
759	R23/6805	YADUNATH	XXXX-XX-3028	\N	3	\N	50	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.032399	2026-07-03 21:19:26.032399	f	\N	f	\N	R23/6805	BANBARI LAL	\N	C-2	3/NA	\N	f
760	R23/8808	POORAN CHAND RANDEY	\N	\N	3	\N	51	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.035189	2026-07-03 21:19:26.035189	t	2023-09-12	f	\N	R23/8808	GOVIND BALABH	\N	C-2	3/NA	2023-09-12	f
761	R23/7126	RAJKUMARI	XXXX-XX-1131	\N	3	\N	51A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.038091	2026-07-03 21:19:26.038091	t	2017-02-04	f	\N	R23/7126	\N	\N	C-2	3/N.A.	2017-02-04	f
762	R23/7350	MEENU GUPTA	XXXX-XX-7501	\N	3	\N	51B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.040888	2026-07-03 21:19:26.040888	t	2024-01-27	f	\N	R23/7350	\N	\N	C-2	3/NA	2024-01-27	f
763	R23/7127	FARIYAD ALI	XXXX-XX-1839	\N	3	\N	52	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.043535	2026-07-03 21:19:26.043535	t	2021-12-07	f	\N	R23/7127	PHEER SHAH	\N	C-2	3/NA	2021-12-07	f
764	R23/7129	RAJENDRA PRASAD	XXXX-XX-3817	\N	3	\N	53	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.046328	2026-07-03 21:19:26.046328	t	2018-06-02	f	\N	R23/7129	KALLU PRASAD	\N	C-2	3/NA	2018-06-02	f
765	R23/10694	ANUPAM MISS	\N	\N	3	\N	54	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.049453	2026-07-03 21:19:26.049453	f	\N	f	\N	R23/10694	S.P SINGH	\N	C-2	3/NA	\N	f
766	R23/7402	PANKAJ KASHYAP	XXXX-XX-0199	\N	3	\N	55	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.053558	2026-07-03 21:19:26.053558	t	2022-11-19	f	\N	R23/7402	NARESH CHAND KASYAP	\N	C-2	3/NA	2022-11-19	f
767	R23/7131	AJIT KUMAR AGARWAL	XXXX-XX-2389	\N	3	\N	56	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.056416	2026-07-03 21:19:26.056416	t	2020-10-13	f	\N	R23/7131	RAM MURTI AGARWAL	\N	C-2	3/NA	2020-10-13	f
769	R23/7411	RITU SAXENA	XXXX-XX-0123	\N	3	\N	58	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.061337	2026-07-03 21:19:26.061337	t	2019-05-06	f	\N	R23/7411	\N	\N	C-2	3/NA	2019-05-06	f
770	R23/7132	HARI PRAKASH	XXXX-XX-7832	\N	3	\N	59	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.063899	2026-07-03 21:19:26.063899	t	2018-06-05	f	\N	R23/7132	JAGDISH PRASAD	\N	C-2	3/NA	2018-06-05	f
771	R23/7410	MANISHA YADAV	XXXX-XX-2638	\N	3	\N	60	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.066463	2026-07-03 21:19:26.066463	t	2022-12-19	f	\N	R23/7410	RAM BAHADUR SINGH YADAV	\N	C-2	3/NA	2022-12-19	f
772	R23/7135	ADESH KUMAR AGARWAL	XXXX-XX-6532	\N	3	\N	61	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.069387	2026-07-03 21:19:26.069387	t	2022-03-21	f	\N	R23/7135	BABU RAM VAISH	\N	C-2	3/NA	2022-03-21	f
773	R23/5016	NISHTHA ANAND	\N	\N	3	\N	62	\N	residential	0.00	\N	\N	t	2026-07-03 21:19:26.072222	2026-07-03 21:19:26.072222	f	\N	f	\N	R23/5016	\N	62	C-2	3/N.A.	\N	f
774	R23/8826	RENUKA KAMAL	\N	\N	3	\N	62	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.075047	2026-07-03 21:19:26.075047	t	2024-07-30	f	\N	R23/8826	\N	\N	C-2	3/NA	2024-07-30	f
775	R23/2358	NEHA SATI	XXXX-XX-6423	\N	3	\N	63	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.077743	2026-07-03 21:19:26.077743	f	\N	f	\N	R23/2358	\N	63	C-2	3/NA	\N	f
776	R23/7136	PRATHMESH BHARDWAJ	\N	\N	3	\N	64	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.080939	2026-07-03 21:19:26.080939	t	2021-04-09	f	\N	R23/7136	A R BHARDWAJ	\N	C-2	3/NA	2021-04-09	f
777	R23/6810	SUMAN SAXENA SMT	XXXX-XX-6319	\N	3	\N	65	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.083807	2026-07-03 21:19:26.083807	f	\N	f	\N	R23/6810	SHIV OM	\N	C-2	3/NA	\N	f
778	R23/7153	PANKAJ SAXENA	XXXX-XX-7872	\N	3	\N	66	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.086665	2026-07-03 21:19:26.086665	t	2018-03-09	f	\N	R23/7153	NARENDRA MOHAN SAXENA	\N	C-2	3/NA	2018-03-09	f
779	R23/8849	DEVENDRA SWARUP VERMA	\N	\N	3	\N	67	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.089393	2026-07-03 21:19:26.089393	t	2025-01-17	f	\N	R23/8849	SHIV SWARUP VERMA	\N	C-2	3/NA	2025-01-17	f
780	R23/6812	NARENDRA SINGH RAJPAL	XXXX-XX-1187	\N	3	\N	68	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.092213	2026-07-03 21:19:26.092213	f	\N	f	\N	R23/6812	AMRIK SINGH RAJPAL	\N	C-2	3/NA	\N	f
781	R23/6814	MANJEET KAUR	XXXX-XX-0395	\N	3	\N	69	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.094699	2026-07-03 21:19:26.094699	f	\N	f	\N	R23/6814	\N	\N	C-2	3/NA	\N	f
782	R23/8820	HARISH KUMAR	\N	\N	3	\N	7	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.097348	2026-07-03 21:19:26.097348	t	2021-04-09	f	\N	R23/8820	PATIRAM	\N	C-2	3/NA	2021-04-09	f
783	R23/7155	JITENDRA KUMAR	XXXX-XX-6980	\N	3	\N	70	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.100013	2026-07-03 21:19:26.100013	t	2021-10-22	f	\N	R23/7155	\N	JAI PRAKASH	C-2	3/NA	2021-10-22	f
784	R23/8823	BALKISHAN SHARMA	\N	\N	3	\N	71	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.102941	2026-07-03 21:19:26.102941	t	2021-10-18	f	\N	R23/8823	\N	\N	C-2	3/NA	2021-10-18	f
785	R23/7156	LOKESH KUMAR	XXXX-XX-8202	\N	3	\N	72	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.107539	2026-07-03 21:19:26.107539	t	2021-01-23	f	\N	R23/7156	RAM SINGH	\N	C-2	3/NA	2021-01-23	f
786	R23/7157	SURENDRA KUMAR	XXXX-XX-6106	\N	3	\N	73	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.110227	2026-07-03 21:19:26.110227	t	2021-01-21	f	\N	R23/7157	\N	\N	C-2	3/NA	2021-01-21	f
787	R23/3159	LAXMI KANT GUPTA	XXXX-XX-4597	\N	3	\N	74	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.113079	2026-07-03 21:19:26.113079	t	2014-08-21	f	\N	R23/3159	J.N GUPTA	74	C-2	3/NA	2014-08-21	f
788	R23/4923	KULDEEP VERMA	\N	\N	3	\N	75	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.11605	2026-07-03 21:19:26.11605	f	\N	f	\N	R23/4923	GYAN SWARUP VERMA	75	C-2	3/NA	\N	f
789	R23/7158	RAJEEV KUMAR	XXXX-XX-3964	\N	3	\N	76	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.118871	2026-07-03 21:19:26.118871	t	2022-07-23	f	\N	R23/7158	RAM CHANDRA	\N	C-2	3/NA	2022-07-23	f
790	R23/7159	ANIL KUMAR GUPTA	\N	\N	3	\N	77	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.121837	2026-07-03 21:19:26.121837	t	2019-01-24	f	\N	R23/7159	R N GUPTA	\N	C-2	3/NA	2019-01-24	f
791	R23/7160	NADEEM MIAN	XXXX-XX-1106	\N	3	\N	78	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.124986	2026-07-03 21:19:26.124986	t	2021-07-07	f	\N	R23/7160	MOHAMMAD YAMIN	\N	C-2	3/NA	2021-07-07	f
792	R23/7161	SAIYYAD MOHAMMAD SHAKIL	XXXX-XX-1729	\N	3	\N	79	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.127636	2026-07-03 21:19:26.127636	t	2021-02-09	f	\N	R23/7161	MOHAMMAD ISHTYAK ALI	\N	C-2	3/NA	2021-02-09	f
793	R23/8839	DEEP KUMAR	XXXX-XX-2956	\N	3	\N	8	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.129954	2026-07-03 21:19:26.129954	f	\N	f	\N	R23/8839	R N SINGH	\N	C-2	3/NA	\N	f
794	R23/7162	CHAITNYA PRAKASH SHARMA	XXXX-XX-2325	\N	3	\N	80	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.132645	2026-07-03 21:19:26.132645	t	2021-07-27	f	\N	R23/7162	BIJENDRA PRAKASH SHARMA	\N	C-2	3/NA	2021-07-27	f
795	R23/7163	SHAILESH GARG	XXXX-XX-3412	\N	3	\N	81	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.135271	2026-07-03 21:19:26.135271	t	2022-01-11	f	\N	R23/7163	RAJESH KUMAR GARG	\N	C-2	3/NA	2022-01-11	f
796	R23/3240	MITLESH SINGH	\N	\N	3	\N	82	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.138229	2026-07-03 21:19:26.138229	t	2023-12-29	f	\N	R23/3240	\N	82	C-2	3/NA	2023-12-29	f
797	R23/7408	SANJAY KUMAR	XXXX-XX-2567	\N	3	\N	83	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.14125	2026-07-03 21:19:26.14125	t	2022-11-19	f	\N	R23/7408	SHAMBHU SARAN SAXENA	\N	C-2	3/NA	2022-11-19	f
798	R23/7164	SUJEET KUMAR	XXXX-XX-2226	\N	3	\N	84	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.144192	2026-07-03 21:19:26.144192	t	2018-04-24	f	\N	R23/7164	CHANDRA KUMAR	\N	C-2	3/NA	2018-04-24	f
799	R23/4252	ASHOK KUMAR	XXXX-XX-7996	\N	3	\N	85	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.146754	2026-07-03 21:19:26.146754	f	\N	f	\N	R23/4252	LATE RAJA RAM	85	C-2	3/NA	\N	f
800	R23/7165	GEETA SHAMRA	XXXX-XX-8636	\N	3	\N	86	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.149893	2026-07-03 21:19:26.149893	t	2021-07-30	f	\N	R23/7165	\N	\N	C-2	3/NA	2021-07-30	f
801	R23/7166	TRILOK SINGH	XXXX-XX-0947	\N	3	\N	87	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.152686	2026-07-03 21:19:26.152686	t	2018-03-19	f	\N	R23/7166	RAGHUNANADAN PRASAD	\N	C-2	3/NA	2018-03-19	f
802	R23/7167	ROHIT KUMAR SHARMA	XXXX-XX-1942	\N	3	\N	88	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.15533	2026-07-03 21:19:26.15533	t	2021-12-10	f	\N	R23/7167	H R SHARMA	\N	C-2	3/NA	2021-12-10	f
803	R23/4345	LAXMI DEVI	XXXX-XX-1112	\N	3	\N	8A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.157916	2026-07-03 21:19:26.157916	f	\N	f	\N	R23/4345	\N	8A	C-2	3/NA	\N	f
804	R23/6794	SANJAY KUMAR	XXXX-XX-5552	\N	3	\N	8B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.160786	2026-07-03 21:19:26.160786	f	\N	f	\N	R23/6794	TEJ SINGH	\N	C-2	3/NA	\N	f
805	R23/8814	PREM KUMAR SACHDEWA	\N	\N	3	\N	9	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.163371	2026-07-03 21:19:26.163371	t	2022-03-07	f	\N	R23/8814	BASUDEV	\N	C-2	3/NA	2022-03-07	f
806	R23/6817	SHIPRA SINGH	XXXX-XX-3533	\N	3	\N	90	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.166904	2026-07-03 21:19:26.166904	f	\N	f	\N	R23/6817	\N	\N	C-2	3/NA	\N	f
807	R23/7168	SUSHIL KUMAR SAXENA	XXXX-XX-3088	\N	3	\N	91	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.169929	2026-07-03 21:19:26.169929	t	2017-09-27	f	\N	R23/7168	S K SAXENA	\N	C-2	3/NA	2017-09-27	f
808	R23/7170	OM PAL	\N	\N	3	\N	92	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.172991	2026-07-03 21:19:26.172991	t	2022-09-03	f	\N	R23/7170	\N	\N	C-2	3/NA	2022-09-03	f
809	R23/7171	K C BAJAJ	XXXX-XX-5550	\N	3	\N	93	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.175835	2026-07-03 21:19:26.175835	t	2019-12-18	f	\N	R23/7171	D R BAJAJ	\N	C-2	3/NA	2019-12-18	f
810	R23/7172	SONAL SANDEEP MAZUMDER	XXXX-XX-8606	\N	3	\N	94	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.178541	2026-07-03 21:19:26.178541	t	2020-03-19	f	\N	R23/7172	\N	\N	C-2	3/NA	2020-03-19	f
811	R23/7174	KRISHNA VERMA	XXXX-XX-4912	\N	3	\N	95	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.180996	2026-07-03 21:19:26.180996	t	2021-11-30	f	\N	R23/7174	\N	\N	C-2	3/NA	2021-11-30	f
812	R23/7175	SANDHYA GUPTA	XXXX-XX-7482	\N	3	\N	96	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.184051	2026-07-03 21:19:26.184051	t	2019-10-03	f	\N	R23/7175	VEERENDRA KUMAR GUPTA	\N	C-2	3/NA	2019-10-03	f
813	R23/7176	RAJESH KUMAR	XXXX-XX-5138	\N	3	\N	97	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.186911	2026-07-03 21:19:26.186911	t	2018-05-08	f	\N	R23/7176	MALLU SINGH	\N	C-2	3/NA	2018-05-08	f
814	R23/4349	RIJUL KANSAL	XXXX-XX-6755	\N	3	\N	97A	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.189848	2026-07-03 21:19:26.189848	f	\N	f	\N	R23/4349	TARA CHAND	97A	C-2	3/NA	\N	f
815	R23/4350	SURESH KUMAR GOYAL, AYUSH GOEL, SHIKHA GOEL	XXXX-XX-8343	\N	3	\N	97B	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.192662	2026-07-03 21:19:26.192662	t	2024-08-09	f	\N	R23/4350	LAKSHMI NARAYAN	97B	C-2	3/NA	2024-08-09	f
816	R23/10756	VISHAL GARG	\N	\N	3	\N	98	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.196008	2026-07-03 21:19:26.196008	t	2023-08-16	f	\N	R23/10756	SURESH CHAND GARG	\N	C-2	3/NA	2023-08-16	f
817	R23/7178	JITENDRA KUMAR SAXENA	XXXX-XX-7117	\N	3	\N	99	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:26.198978	2026-07-03 21:19:26.198978	t	2017-10-17	f	\N	R23/7178	SUDHIR KUMAR SAXENA	\N	C-2	3/NA	2017-10-17	f
818	R23/9056	RAVI PRAKASH	\N	\N	3	\N	1	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.201823	2026-07-03 21:19:26.201823	t	2019-12-10	f	\N	R23/9056	SURAJ KPRAKASH	\N	C-3	3/NA	2019-12-10	f
819	R23/4050	DILIP SINGH	XXXX-XX-3129	\N	3	\N	10	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.204742	2026-07-03 21:19:26.204742	t	2024-03-27	f	\N	R23/4050	NARENDRA PAL SINGH	10	C-3	3/NA	2024-03-27	f
820	R23/7710	VIRJESH SAXENA	\N	\N	3	\N	100	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.207544	2026-07-03 21:19:26.207544	t	2014-06-27	f	\N	R23/7710	D K SAXENA	\N	C-3	3/NA	2014-06-27	f
821	R23/9095	SARITYA GANGAGWAR S	\N	\N	3	\N	101	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.210805	2026-07-03 21:19:26.210805	t	2010-03-29	f	\N	R23/9095	PRAMOD KUMAR GANGWAR	\N	C-3	3/NA	2010-03-29	f
822	R23/7716	ALKA AGARWAL	\N	\N	3	\N	102	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.213472	2026-07-03 21:19:26.213472	t	2011-12-13	f	\N	R23/7716	AJAI KUMA AGARWAL	\N	C-3	3/NA	2011-12-13	f
823	R23/7718	PRACHI AGARWAL	\N	\N	3	\N	103	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.216192	2026-07-03 21:19:26.216192	t	2008-06-11	f	\N	R23/7718	\N	\N	C-3	3/NA	2008-06-11	f
824	R23/8214	PRIYANKA GAUTAM	\N	\N	3	\N	104	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.218834	2026-07-03 21:19:26.218834	t	2022-12-26	f	\N	R23/8214	\N	104	C-3	3/NA	2022-12-26	f
825	R23/7721	PRADEEP KUMAR VERMA	\N	\N	3	\N	105	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.222216	2026-07-03 21:19:26.222216	t	2016-03-19	f	\N	R23/7721	JIVAN LAL VERMA	\N	C-3	3/NA	2016-03-19	f
826	R23/7722	NEERAJ KUMAR SRIVASTAVA	\N	\N	3	\N	106	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.224994	2026-07-03 21:19:26.224994	t	2013-12-17	f	\N	R23/7722	K N SRIVASTAVA	\N	C-3	3/NA	2013-12-17	f
827	R23/7726	CHHAVI PRAKASH GOYAL	\N	\N	3	\N	107	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.227736	2026-07-03 21:19:26.227736	t	2008-12-30	f	\N	R23/7726	PREM NARAIN GOYAL	\N	C-3	3/NA	2008-12-30	f
828	R23/7757	BHARTI SHARMA	\N	\N	3	\N	108	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.230521	2026-07-03 21:19:26.230521	t	2018-06-28	f	\N	R23/7757	ARUN MUNDAWAL	\N	C-3	3/NA	2018-06-28	f
829	R23/7759	BHAWANA VERMA	\N	\N	3	\N	109	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.233371	2026-07-03 21:19:26.233371	t	2020-11-11	f	\N	R23/7759	\N	\N	C-3	3/NA	2020-11-11	f
830	R23/4245	RINKOO KAMBOJ	XXXX-XX-6219	\N	3	\N	10A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.236206	2026-07-03 21:19:26.236206	f	\N	f	\N	R23/4245	SHER CHAND	10A	C-3	3/NA	\N	f
831	R23/4246	REKHA KOTHARI, SUBHASH KOTHARI	XXXX-XX-3455	\N	3	\N	10B	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.239112	2026-07-03 21:19:26.239112	t	2024-11-11	f	\N	R23/4246	\N	10B	C-3	3/NA	2024-11-11	f
832	R23/9238	AJAY KUMAR DEVAL	XXXX-XX-7518	\N	3	\N	10C	\N	residential	630.00	\N	\N	t	2026-07-03 21:19:26.241793	2026-07-03 21:19:26.241793	f	\N	f	\N	R23/9238	SURESH KUMAR DEVAL	\N	C-3	3/NA	\N	f
833	R23/6669	MOHD FARHAN	XXXX-XX-8634	\N	3	\N	11	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.244486	2026-07-03 21:19:26.244486	f	\N	f	\N	R23/6669	SAGHEER AHMAD SIDIQUI	\N	C-3	3/NA	\N	f
834	R23/7760	MUKESH YADAV	\N	\N	3	\N	110	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.247396	2026-07-03 21:19:26.247396	t	2013-11-08	f	\N	R23/7760	KHUNNA LAL YADAV	\N	C-3	3/NA	2013-11-08	f
835	R23/7762	ZAHID HUSSAIN SIDDQI	\N	\N	3	\N	111	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.250181	2026-07-03 21:19:26.250181	t	2012-03-31	f	\N	R23/7762	AZMAT HUSSAIN	\N	C-3	3/NA	2012-03-31	f
836	R23/7764	RAMCHANDRA	\N	\N	3	\N	112	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.253317	2026-07-03 21:19:26.253317	t	2008-11-28	f	\N	R23/7764	KANHI LAL	\N	C-3	3/NA	2008-11-28	f
837	R23/7765	SANJEEV KUMAR	\N	\N	3	\N	113	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.256504	2026-07-03 21:19:26.256504	t	2012-01-23	f	\N	R23/7765	RAMESH CHANDRA	\N	C-3	3/NA	2012-01-23	f
838	R23/7767	MINAKSHI	\N	\N	3	\N	114	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.259655	2026-07-03 21:19:26.259655	t	2008-07-27	f	\N	R23/7767	\N	\N	C-3	3/NA	2008-07-27	f
839	R23/7771	CHETTRA MISHRA	\N	\N	3	\N	115	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.262431	2026-07-03 21:19:26.262431	t	2013-06-03	f	\N	R23/7771	\N	\N	C-3	3/NA	2013-06-03	f
840	R23/7773	AMIT AGARWAL	\N	\N	3	\N	116	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.265286	2026-07-03 21:19:26.265286	t	2012-03-31	f	\N	R23/7773	SATYA NARYAN AGARWAL	\N	C-3	3/NA	2012-03-31	f
841	R23/7778	RITESH AGARWAL	\N	\N	3	\N	117	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.268052	2026-07-03 21:19:26.268052	t	2010-07-05	f	\N	R23/7778	UMESH KUMAR AGARWAL	\N	C-3	3/NA	2010-07-05	f
842	R23/7781	VINOD KUMAR PAL	\N	\N	3	\N	118	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.270655	2026-07-03 21:19:26.270655	t	2021-07-19	f	\N	R23/7781	RAM KISHAN PAL	\N	C-3	3/NA	2021-07-19	f
843	R23/7783	SURENDRA SINGH	\N	\N	3	\N	119	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.272943	2026-07-03 21:19:26.272943	t	2008-05-31	f	\N	R23/7783	BHOLA NATH	\N	C-3	3/NA	2008-05-31	f
844	R23/9292	BRIJENDRA PAL SINGH	\N	\N	3	\N	12	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.275881	2026-07-03 21:19:26.275881	f	\N	f	\N	R23/9292	RAGHUNATH SINGH	\N	C-3	3/NA	\N	f
845	R23/9096	MADHU BALA SAXENA KM	\N	\N	3	\N	120	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.278742	2026-07-03 21:19:26.278742	t	2018-04-13	f	\N	R23/9096	SHIV VIDHYA SARSWATI	\N	C-3	3/NA	2018-04-13	f
846	R23/9097	RACHIKA R	\N	\N	3	\N	121	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.281513	2026-07-03 21:19:26.281513	t	2017-10-07	f	\N	R23/9097	RATNESH CHANDRA	\N	C-3	3/NA	2017-10-07	f
847	R23/9098	ASHA VERMA A	\N	\N	3	\N	122	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.283948	2026-07-03 21:19:26.283948	t	2012-03-31	f	\N	R23/9098	HARI RAM VERMA	\N	C-3	3/NA	2012-03-31	f
848	R23/9209	ANJUM GAZALA	\N	\N	3	\N	123	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.286493	2026-07-03 21:19:26.286493	f	\N	f	\N	R23/9209	TAJAMMUL HUSSAIN	\N	C-3	3/NA	\N	f
849	R23/9099	SOBHA MISHRAM	\N	\N	3	\N	124	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.289146	2026-07-03 21:19:26.289146	t	2014-05-25	f	\N	R23/9099	RAVINDRA NATH MISHRA	\N	C-3	3/NA	2014-05-25	f
850	R23/9100	SUDHA PANDEY	\N	\N	3	\N	125	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.292083	2026-07-03 21:19:26.292083	t	2012-11-28	f	\N	R23/9100	PRELAD PANDEY	\N	C-3	3/NA	2012-11-28	f
851	R23/9101	MAMTA PAL	\N	\N	3	\N	126	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.29474	2026-07-03 21:19:26.29474	t	2014-08-26	f	\N	R23/9101	NETRA PAL SINGH	\N	C-3	3/NA	2014-08-26	f
852	R23/9102	JYOTI MAHESHWARI J	\N	\N	3	\N	127	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.298241	2026-07-03 21:19:26.298241	t	2010-12-01	f	\N	R23/9102	KAMAL KISHORE	\N	C-3	3/NA	2010-12-01	f
853	R23/9106	PRAVEEN KUMAR RATHOR	\N	\N	3	\N	128	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.300783	2026-07-03 21:19:26.300783	t	2021-07-16	f	\N	R23/9106	SRI BRAHIM PRAKASH RATHORE	\N	C-3	3/NA	2021-07-16	f
854	R23/9107	VIMAL KUMAR	\N	\N	3	\N	129	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.309487	2026-07-03 21:19:26.309487	t	2008-11-19	f	\N	R23/9107	ROSHAN LAL	\N	C-3	3/N.A.	2008-11-19	f
855	R23/9062	MAANAS BANSAL	\N	\N	3	\N	13	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.312534	2026-07-03 21:19:26.312534	t	2022-07-18	f	\N	R23/9062	RAKESH KUMAR AGRWAL	\N	C-3	3/NA	2022-07-18	f
856	R23/9119	KALAWATI	\N	\N	3	\N	130	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.315468	2026-07-03 21:19:26.315468	t	2021-02-19	f	\N	R23/9119	SRI JHAJAN LAL	\N	C-3	3/NA	2021-02-19	f
857	R23/7801	ANUJ KUMAR	\N	\N	3	\N	131	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.318367	2026-07-03 21:19:26.318367	t	2010-06-25	f	\N	R23/7801	HARISH CHANDRA SAXENA	\N	C-3	3/NA	2010-06-25	f
858	R23/9109	SEEMA PUSHP	\N	\N	3	\N	132	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.321266	2026-07-03 21:19:26.321266	f	\N	f	\N	R23/9109	SANJEEV PUSHP	\N	C-3	3/NA	\N	f
859	R23/8186	ANWAR ALI	\N	\N	3	\N	133	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.324088	2026-07-03 21:19:26.324088	t	2008-10-07	f	\N	R23/8186	\N	133	C-3	3/NA	2008-10-07	f
860	R23/8218	FIROJ BANO	\N	\N	3	\N	134	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.327198	2026-07-03 21:19:26.327198	t	2014-08-07	f	\N	R23/8218	VADIA RAMCHANDRA AGARWAL	\N	C-3	3/NA	2014-08-07	f
861	R23/7802	SUMAN BHASIN	XXXX-XX-1116	\N	3	\N	135	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.330084	2026-07-03 21:19:26.330084	t	2019-06-21	f	\N	R23/7802	\N	\N	C-3	3/NA	2019-06-21	f
862	R23/7803	AMAR SINGH	XXXX-XX-0059	\N	3	\N	136	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.333014	2026-07-03 21:19:26.333014	t	2021-06-18	f	\N	R23/7803	VIJENNDRA SINGH	\N	C-3	3/NA	2021-06-18	f
863	R23/6675	KUNAL URF KUNAL KUMAR DEVAL	XXXX-XX-2762	\N	3	\N	137	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.336164	2026-07-03 21:19:26.336164	f	\N	f	\N	R23/6675	\N	\N	C-3	3/NA	\N	f
864	R23/7804	AJEET KUMAR BISARIA	XXXX-XX-1428	\N	3	\N	138	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.339099	2026-07-03 21:19:26.339099	t	2017-07-03	f	\N	R23/7804	ASHOK KUMA BISARIA	\N	C-3	3/NA	2017-07-03	f
865	R23/7805	ARJUN VERMA	\N	\N	3	\N	139	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.341715	2026-07-03 21:19:26.341715	t	2018-10-10	f	\N	R23/7805	PRADEEP KUMAR VERMA	\N	C-3	3/NA	2018-10-10	f
866	R23/9063	SHILPI AGARWAL	\N	\N	3	\N	14	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.344593	2026-07-03 21:19:26.344593	t	2022-07-18	f	\N	R23/9063	RAKESH KUMAR AGARWAL	\N	C-3	3/NA	2022-07-18	f
867	R23/7809	SARVESH KUMAR	\N	\N	3	\N	140	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.347829	2026-07-03 21:19:26.347829	t	2022-07-27	f	\N	R23/7809	RAM KIRSHAN SHARMA	\N	C-3	3/NA	2022-07-27	f
868	R23/7811	PREM SHANKAR AGARWAL	\N	\N	3	\N	141	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.351802	2026-07-03 21:19:26.351802	t	2022-07-22	f	\N	R23/7811	BANKEY LAL	\N	C-3	3/NA	2022-07-22	f
869	R23/7812	ANITA AGARWAL	\N	\N	3	\N	142	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.354658	2026-07-03 21:19:26.354658	t	2017-09-25	f	\N	R23/7812	AMIT AGARWAL	\N	C-3	3/NA	2017-09-25	f
870	R23/7814	PARUL SAXENA	XXXX-XX-4995	\N	3	\N	143	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.357535	2026-07-03 21:19:26.357535	t	2018-05-08	f	\N	R23/7814	\N	\N	C-3	3/NA	2018-05-08	f
871	R23/9193	DEEDAR SINGH	\N	\N	3	\N	144	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.360412	2026-07-03 21:19:26.360412	t	2024-07-27	f	\N	R23/9193	RANJIT SINGH	\N	C-3	3/NA	2024-07-27	f
924	R23/7890	ASHOK KUMAR KANCHAN	\N	\N	3	\N	192	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.516016	2026-07-03 21:19:26.516016	t	2008-05-19	f	\N	R23/7890	NAROTTAM SINGH SAXNA	\N	C-3	3/NA	2008-05-19	f
872	R23/7816	BDRIJENDER SINGH YADAV	XXXX-XX-1829	\N	3	\N	145	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.363415	2026-07-03 21:19:26.363415	t	2018-05-18	f	\N	R23/7816	SUBHASH CHANDRA YADAV	\N	C-3	3/NA	2018-05-18	f
873	R23/8223	SANJEEV KUMAR BHASIN	XXXX-XX-0317	\N	3	\N	146	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.366382	2026-07-03 21:19:26.366382	t	2023-03-18	f	\N	R23/8223	M L BHASIN	146	C-3	3/NA	2023-03-18	f
874	R23/9242	BRIJ PAL SINGH SHARMA	\N	\N	3	\N	147	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.369266	2026-07-03 21:19:26.369266	t	2024-11-13	f	\N	R23/9242	\N	\N	C-3	3/NA	2024-11-13	f
875	R23/8179	ASHISH PRIYA	XXXX-XX-3723	\N	3	\N	148	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.372197	2026-07-03 21:19:26.372197	t	2023-05-06	f	\N	R23/8179	GREESH KUMAR	148	C-3	3/NA	2023-05-06	f
876	R23/6678	MONEET NAGPAL	XXXX-XX-5107	\N	3	\N	149	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.375127	2026-07-03 21:19:26.375127	f	\N	f	\N	R23/6678	JOGINDER NAGPAL	\N	C-3	3/NA	\N	f
877	R23/9064	JAGDESH NEGI	XXXX-XX-2565	\N	3	\N	15	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.377977	2026-07-03 21:19:26.377977	t	2018-05-08	f	\N	R23/9064	S CS NEGI	\N	C-3	3/NA	2018-05-08	f
878	R23/6680	RAVINDRA TIWARI	XXXX-XX-4259	\N	3	\N	150	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.380994	2026-07-03 21:19:26.380994	f	\N	f	\N	R23/6680	RAM SHANKAR TIWARI	\N	C-3	3/NA	\N	f
879	R23/6681	AJIT SINGH	XXXX-XX-7820	\N	3	\N	151	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.383983	2026-07-03 21:19:26.383983	f	\N	f	\N	R23/6681	RAJA RAM	\N	C-3	3/NA	\N	f
880	R23/7817	RITU MAURYA	XXXX-XX-2548	\N	3	\N	152	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.386611	2026-07-03 21:19:26.386611	t	2018-02-15	f	\N	R23/7817	\N	\N	C-3	3/NA	2018-02-15	f
881	R23/7819	ASHOK KUMAR	XXXX-XX-3658	\N	3	\N	153	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.38938	2026-07-03 21:19:26.38938	t	2021-07-16	f	\N	R23/7819	JAGDISH SARAN	\N	C-3	3/NA	2021-07-16	f
882	R23/7821	RANJEET SINGH	\N	\N	3	\N	154	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.393032	2026-07-03 21:19:26.393032	t	2021-12-03	f	\N	R23/7821	PATI RAM	\N	C-3	3/NA	2021-12-03	f
883	R23/7823	KRISHAN KUMAR	\N	\N	3	\N	155	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.395995	2026-07-03 21:19:26.395995	t	2008-11-10	f	\N	R23/7823	LAL BHADUR	\N	C-3	3/NA	2008-11-10	f
884	R23/10771	ANEETA SHARMA	\N	\N	3	\N	156	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.400437	2026-07-03 21:19:26.400437	t	2022-09-28	f	\N	R23/10771	MADAN LAL SHARMA	\N	C-3	3/NA	2022-09-28	f
885	R23/7825	NEELAM	\N	\N	3	\N	157	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.403178	2026-07-03 21:19:26.403178	t	2010-08-23	f	\N	R23/7825	\N	\N	C-3	3/NA	2010-08-23	f
886	R23/7826	PRADEEP GUPTA	\N	\N	3	\N	159	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.405956	2026-07-03 21:19:26.405956	t	2009-03-31	f	\N	R23/7826	RAMMURTI GUPTA	\N	C-3	3/N.A.	2009-03-31	f
887	R23/9065	NEERAJ SHAMRA	\N	\N	3	\N	16	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.408763	2026-07-03 21:19:26.408763	t	2013-07-03	f	\N	R23/9065	VIRENDRA KUMAR SHRAMA	\N	C-3	3/NA	2013-07-03	f
888	R23/7827	INDRA JOHARI	\N	\N	3	\N	160	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.41156	2026-07-03 21:19:26.41156	t	2009-12-15	f	\N	R23/7827	\N	\N	C-3	3/NA	2009-12-15	f
889	R23/7828	SHALINI VERMA	\N	\N	3	\N	161	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.414497	2026-07-03 21:19:26.414497	t	2008-12-28	f	\N	R23/7828	\N	\N	C-3	3/NA	2008-12-28	f
890	R23/7830	JUHI JAISWAL	\N	\N	3	\N	162	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.417179	2026-07-03 21:19:26.417179	t	2008-12-28	f	\N	R23/7830	\N	\N	C-3	3/NA	2008-12-28	f
891	R23/4247	ADITI SINGH	XXXX-XX-9084	\N	3	\N	162A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.419909	2026-07-03 21:19:26.419909	f	\N	f	\N	R23/4247	SATYA PRAKASH	162A	C-3	3/NA	\N	f
892	R23/7832	NEERAJ KUMAR GUPTA	XXXX-XX-0086	\N	3	\N	163	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.422555	2026-07-03 21:19:26.422555	t	2018-06-14	f	\N	R23/7832	\N	\N	C-3	3/NA	2018-06-14	f
893	R23/9158	NAVEEN KUMAR SHANKHDHAR	\N	\N	3	\N	164	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.424936	2026-07-03 21:19:26.424936	t	2009-07-09	f	\N	R23/9158	SHREE RAM SHANKHDHAR	\N	C-3	3/NA	2009-07-09	f
894	R23/10768	SUMAN DEEP SINGH	\N	\N	3	\N	165	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.428359	2026-07-03 21:19:26.428359	t	2011-09-22	f	\N	R23/10768	P P SINGH	\N	C-3	3/NA	2011-09-22	f
895	R23/7854	RAVI KANT	\N	\N	3	\N	166	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.431	2026-07-03 21:19:26.431	t	2011-09-07	f	\N	R23/7854	ISHWARI PRASAD	\N	C-3	3/NA	2011-09-07	f
896	R23/7855	VIMAL KUMAR JAIN	\N	\N	3	\N	167	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.433623	2026-07-03 21:19:26.433623	t	2009-12-29	f	\N	R23/7855	JAGDISH PRASAD JAIN	\N	C-3	3/NA	2009-12-29	f
897	R23/7856	CHANDAR PAL	\N	\N	3	\N	168	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.43622	2026-07-03 21:19:26.43622	t	2011-05-31	f	\N	R23/7856	NAND RAM	\N	C-3	3/NA	2011-05-31	f
898	R23/7857	DEEPAK SHARMA	\N	\N	3	\N	169	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.440026	2026-07-03 21:19:26.440026	t	2012-02-16	f	\N	R23/7857	SURESH CHAND SHARMA	\N	C-3	3/NA	2012-02-16	f
899	R23/9066	SUSHMA YADAV SMT	\N	\N	3	\N	17	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.44425	2026-07-03 21:19:26.44425	t	2009-10-12	f	\N	R23/9066	MANOHAR SINGH	\N	C-3	3/NA	2009-10-12	f
900	R23/9128	PRADEEP KUMAR AGARWAL A	\N	\N	3	\N	170	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.447731	2026-07-03 21:19:26.447731	t	2018-02-26	f	\N	R23/9128	SRI HAWAB SINGH	\N	C-3	3/NA	2018-02-26	f
901	R23/7858	SHIV KUMAR	\N	\N	3	\N	171	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.450408	2026-07-03 21:19:26.450408	t	2009-01-09	f	\N	R23/7858	RAJ BAHADUR	\N	C-3	3/NA	2009-01-09	f
902	R23/7859	TARA CHAND GOEL	\N	\N	3	\N	172	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.453255	2026-07-03 21:19:26.453255	t	2008-04-30	f	\N	R23/7859	DAULAT RAM	\N	C-3	3/NA	2008-04-30	f
903	R23/7860	KISHAN AWATAR PAL	\N	\N	3	\N	173	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.456173	2026-07-03 21:19:26.456173	t	2010-03-31	f	\N	R23/7860	RAM JI DASS PALL	\N	C-3	3/NA	2010-03-31	f
904	R23/7862	AMRIT PRASAD AGARWAL	\N	\N	3	\N	174	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.458548	2026-07-03 21:19:26.458548	t	2011-08-06	f	\N	R23/7862	R D AGARWAL	\N	C-3	3/NA	2011-08-06	f
905	R23/7864	NAVDEERPKANCHAN	\N	\N	3	\N	175	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.461284	2026-07-03 21:19:26.461284	t	2021-02-18	f	\N	R23/7864	DEVENDRA K KANCHAN	\N	C-3	3/NA	2021-02-18	f
906	R23/7866	RAJEEV KUMAR GUPTA	\N	\N	3	\N	176	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.464117	2026-07-03 21:19:26.464117	t	2012-03-26	f	\N	R23/7866	SATYA DEV GUPTA	\N	C-3	3/NA	2012-03-26	f
907	R23/7868	SANJEEV KUMAR MISHRA	\N	\N	3	\N	177	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.466907	2026-07-03 21:19:26.466907	t	2011-08-12	f	\N	R23/7868	GIRJA SHANKAR MISHRA	\N	C-3	3/NA	2011-08-12	f
908	R23/7869	NIRMALA DEVI BISHT	\N	\N	3	\N	178	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.469299	2026-07-03 21:19:26.469299	t	2008-12-28	f	\N	R23/7869	HEM CHAND BISHT	\N	C-3	3/NA	2008-12-28	f
909	R23/7871	RACHNA AGARWAL	\N	\N	3	\N	179	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.472174	2026-07-03 21:19:26.472174	t	2010-06-24	f	\N	R23/7871	\N	\N	C-3	3/NA	2010-06-24	f
910	R23/3996	RAJNI DUBEY	XXXX-XX-9723	\N	3	\N	18	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.475126	2026-07-03 21:19:26.475126	t	2024-02-03	f	\N	R23/3996	\N	18	C-3	3/NA	2024-02-03	f
911	R23/8228	SHALENDRA KUMAR MISHRA	\N	\N	3	\N	180	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.477972	2026-07-03 21:19:26.477972	t	2020-09-04	f	\N	R23/8228	MADAN MOHAN MISHRA	180	C-3	3/NA	2020-09-04	f
912	R23/8187	BIRENDRA SINGH	XXXX-XX-8494	\N	3	\N	181	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.480911	2026-07-03 21:19:26.480911	t	2009-10-20	f	\N	R23/8187	BABURAM	181	C-3	3/NA	2009-10-20	f
913	R23/7874	B K AVASTHI	\N	\N	3	\N	182	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.484519	2026-07-03 21:19:26.484519	t	2008-04-02	f	\N	R23/7874	O P AVASTHI	\N	C-3	3/NA	2008-04-02	f
914	R23/7876	ANIL KUMAR	\N	\N	3	\N	183	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.487254	2026-07-03 21:19:26.487254	t	2021-07-20	f	\N	R23/7876	OM PRAKASH	\N	C-3	3/NA	2021-07-20	f
915	R23/9133	KOMAL MITTAL	\N	\N	3	\N	184	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.489929	2026-07-03 21:19:26.489929	t	2008-11-30	f	\N	R23/9133	DINESH CHANDRA	\N	C-3	3/NA	2008-11-30	f
916	R23/9131	SANTOSH SAXENA, MAHENDRA KUMAR SAXENA	\N	\N	3	\N	185	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.492985	2026-07-03 21:19:26.492985	t	2012-01-25	f	\N	R23/9131	\N	\N	C-3	3/NA	2012-01-25	f
917	R23/9137	VIRENDRA PAL SINGH	\N	\N	3	\N	186	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.49588	2026-07-03 21:19:26.49588	t	2011-06-22	f	\N	R23/9137	SRI RAM RATHORE	\N	C-3	3/NA	2011-06-22	f
918	R23/7877	SANJEEV KUMAR PANDEY	\N	\N	3	\N	187	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.498869	2026-07-03 21:19:26.498869	t	2008-12-28	f	\N	R23/7877	RAM RATAN PANDEY	\N	C-3	3/NA	2008-12-28	f
919	R23/7880	ANITA AGARWAL	\N	\N	3	\N	188	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.501763	2026-07-03 21:19:26.501763	t	2008-10-16	f	\N	R23/7880	\N	\N	C-3	3/NA	2008-10-16	f
920	R23/7882	GIRISH CHANDRA	\N	\N	3	\N	189	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.504627	2026-07-03 21:19:26.504627	t	2008-12-29	f	\N	R23/7882	RAM SWAROOP	\N	C-3	3/NA	2008-12-29	f
921	R23/9067	PRADEEP KUMAR 1	XXXX-XX-3363	\N	3	\N	19	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.507424	2026-07-03 21:19:26.507424	t	2018-06-05	f	\N	R23/9067	RAM BABU RASENA	\N	C-3	3/NA	2018-06-05	f
922	R23/9124	RAMESH CHANDRA	\N	\N	3	\N	190	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.510269	2026-07-03 21:19:26.510269	t	2008-08-23	f	\N	R23/9124	BANARSI	\N	C-3	3/NA	2008-08-23	f
923	R23/7888	BRIJ MOHAN SONI	\N	\N	3	\N	191	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.513276	2026-07-03 21:19:26.513276	t	2008-05-22	f	\N	R23/7888	R L SONI	\N	C-3	3/NA	2008-05-22	f
925	R23/7898	RUCHI AGARWAL	\N	\N	3	\N	193	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.519466	2026-07-03 21:19:26.519466	t	2010-11-01	f	\N	R23/7898	PRAVEEN AGARWAL	\N	C-3	3/NA	2010-11-01	f
926	R23/7899	SHASHI KANT	\N	\N	3	\N	194	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.527333	2026-07-03 21:19:26.527333	t	2020-11-11	f	\N	R23/7899	SRI RAM PRASAD	\N	C-3	3/NA	2020-11-11	f
927	R23/7902	VIVEK AGARWAL	\N	\N	3	\N	195	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.532081	2026-07-03 21:19:26.532081	t	2011-12-28	f	\N	R23/7902	SURESH CHANDRA AGARWAL	\N	C-3	3/NA	2011-12-28	f
928	R23/7904	JAGDDISH PRASAD	\N	\N	3	\N	196	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.535437	2026-07-03 21:19:26.535437	t	2009-03-20	f	\N	R23/7904	POTHI RAM	\N	C-3	3/NA	2009-03-20	f
929	R23/6682	SHUSHIL KUMAR PANDEY	\N	\N	3	\N	197	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.538185	2026-07-03 21:19:26.538185	f	\N	f	\N	R23/6682	\N	\N	C-3	3/NA	\N	f
930	R23/9153	MOHAMMAD TAHIR ARIF	\N	\N	3	\N	198	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.540898	2026-07-03 21:19:26.540898	t	2008-12-30	f	\N	R23/9153	MOHAMMAD ARIF	\N	C-3	3/NA	2008-12-30	f
931	R23/4248	POONAM SHARMA	XXXX-XX-4274	\N	3	\N	198A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.543777	2026-07-03 21:19:26.543777	f	\N	f	\N	R23/4248	\N	198A	C-3	3/NA	\N	f
932	R23/7905	VIJAY KUMAR AGARWAL	\N	\N	3	\N	199	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.546625	2026-07-03 21:19:26.546625	t	2019-08-20	f	\N	R23/7905	RAJESHWAR PRASAD AGARWAL	\N	C-3	3/NA	2019-08-20	f
933	R23/9057	AMIT MOORJANI A	\N	\N	3	\N	2	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.549431	2026-07-03 21:19:26.549431	t	2018-11-30	f	\N	R23/9057	RAMESH MOORJANI	\N	C-3	3/NA	2018-11-30	f
934	R23/8175	ARVIND KUMAR NAITHANI	XXXX-XX-1810	\N	3	\N	20	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.552169	2026-07-03 21:19:26.552169	t	2012-04-02	f	\N	R23/8175	S P NAITHANI	20	C-3	3/NA	2012-04-02	f
935	R23/7907	RAVINDDRA AGARWAL	\N	\N	3	\N	200	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.555067	2026-07-03 21:19:26.555067	t	2008-04-26	f	\N	R23/7907	RAM RATAN LAL AGARWAL	\N	C-3	3/NA	2008-04-26	f
936	R23/7910	VINA ARORA	\N	\N	3	\N	201	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.558169	2026-07-03 21:19:26.558169	t	2008-05-15	f	\N	R23/7910	\N	\N	C-3	3/NA	2008-05-15	f
937	R23/7914	SWETA KHANDELWAL	\N	\N	3	\N	202	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.561063	2026-07-03 21:19:26.561063	t	2010-03-29	f	\N	R23/7914	ANUJ KHANDELWAL	\N	C-3	3/NA	2010-03-29	f
938	R23/7916	VIKAS SAXENA	XXXX-XX-9121	\N	3	\N	203	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.563638	2026-07-03 21:19:26.563638	t	2018-04-07	f	\N	R23/7916	OM PRAKASH SAXENA	\N	C-3	3/NA	2018-04-07	f
939	R23/9296	RAMAKANT DUBY	\N	\N	3	\N	204	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.566529	2026-07-03 21:19:26.566529	t	2017-03-25	f	\N	R23/9296	KISORI LAL DEBEY	\N	C-3	3/NA	2017-03-25	f
940	R23/7917	RAKESH KUMAR SAXENA	\N	\N	3	\N	205	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.568886	2026-07-03 21:19:26.568886	t	2008-08-12	f	\N	R23/7917	SRI SEWA RAM	\N	C-3	3/NA	2008-08-12	f
941	R23/7919	PRITI AGARWAL	\N	\N	3	\N	206	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.571767	2026-07-03 21:19:26.571767	t	2020-10-29	f	\N	R23/7919	\N	\N	C-3	3/NA	2020-10-29	f
942	R23/7921	HAYAT WARIS SAIFI	\N	\N	3	\N	207	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.5744	2026-07-03 21:19:26.5744	t	2008-08-21	f	\N	R23/7921	JAMAL AHMAD SAFI	\N	C-3	3/NA	2008-08-21	f
943	R23/7922	SUBODH KUMAR	\N	\N	3	\N	208	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.577799	2026-07-03 21:19:26.577799	t	2010-01-29	f	\N	R23/7922	SRI POPI KRISHAN	\N	C-3	3/NA	2010-01-29	f
944	R23/7936	SHOBHA SAXENA	\N	\N	3	\N	209	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.580378	2026-07-03 21:19:26.580378	t	2013-06-04	f	\N	R23/7936	\N	\N	C-3	3/NA	2013-06-04	f
945	R23/3061	KIRAN SAXENA	XXXX-XX-2026	\N	3	\N	21	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.583212	2026-07-03 21:19:26.583212	t	2023-09-23	f	\N	R23/3061	\N	21	C-3	3/NA	2023-09-23	f
946	R23/7925	RAJESH KUMAR MISRA	\N	\N	3	\N	210	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.586104	2026-07-03 21:19:26.586104	t	2011-05-18	f	\N	R23/7925	\N	JAGDEESH CHNDRA MISRA	C-3	3/NA	2011-05-18	f
947	R23/7927	MUKESH KUMAR	XXXX-XX-5565	\N	3	\N	211	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.588758	2026-07-03 21:19:26.588758	t	2022-09-28	f	\N	R23/7927	MAHESH KUMAR	\N	C-3	3/NA	2022-09-28	f
948	R23/3167	MOHAMMAD KHALID ANSARI	\N	\N	3	\N	212	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.591551	2026-07-03 21:19:26.591551	t	2023-10-31	f	\N	R23/3167	RAJ KUMAR JAIN	212	C-3	3/NA	2023-10-31	f
949	R23/8093	VISHNU SWAROOP SHARMA	\N	\N	3	\N	213	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.594722	2026-07-03 21:19:26.594722	t	2025-05-28	f	\N	R23/8093	PURN MAL SHARA	\N	C-3	3/NA	2025-05-28	f
950	R23/7928	RAVINDAR KUMAR GUPTA	\N	\N	3	\N	214	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.598358	2026-07-03 21:19:26.598358	t	2008-10-07	f	\N	R23/7928	RAM MURTI LAL GUPTA	\N	C-3	3/NA	2008-10-07	f
951	R23/7929	JEET PAL SINGH NEGI	\N	\N	3	\N	215	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.601166	2026-07-03 21:19:26.601166	t	2011-03-22	f	\N	R23/7929	DHOOM SINGH NEGI	\N	C-3	3/NA	2011-03-22	f
952	R23/7930	ANIL KAPOOR	\N	\N	3	\N	216	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.603959	2026-07-03 21:19:26.603959	t	2010-01-06	f	\N	R23/7930	DEENANATH KAPOOR	\N	C-3	3/NA	2010-01-06	f
953	R23/7932	RADHA GOYAL	\N	\N	3	\N	217	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.606707	2026-07-03 21:19:26.606707	t	2008-08-08	f	\N	R23/7932	\N	\N	C-3	3/NA	2008-08-08	f
954	R23/7933	VIJAY KUMAR	\N	\N	3	\N	218	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.609142	2026-07-03 21:19:26.609142	t	2021-07-20	f	\N	R23/7933	OM PRAKASH	\N	C-3	3/NA	2021-07-20	f
955	R23/8188	JITENDRA SINGH	XXXX-XX-3703	\N	3	\N	219	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.61211	2026-07-03 21:19:26.61211	t	2023-01-10	f	\N	R23/8188	NOBATA RAM	219	C-3	3/NA	2023-01-10	f
956	R23/6671	SANJAY VERMA	XXXX-XX-2292	\N	3	\N	22	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.615001	2026-07-03 21:19:26.615001	f	\N	f	\N	R23/6671	DEVENDRA SHAROP VERMA	\N	C-3	3/NA	\N	f
957	R23/7934	BHAVNIDHI SHARMA	XXXX-XX-0485	\N	3	\N	220	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.618738	2026-07-03 21:19:26.618738	t	2018-07-28	f	\N	R23/7934	B P SHARMA	\N	C-3	3/NA	2018-07-28	f
958	R23/9456	ANIL KUMAR ANAND	XXXX-XX-8725	\N	3	\N	221	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.622796	2026-07-03 21:19:26.622796	t	2024-11-29	f	\N	R23/9456	GHAMANDI SINGH	\N	C-3	3/NA	2024-11-29	f
959	R23/7935	PRADEEP KUMAR	XXXX-XX-1814	\N	3	\N	222	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.625534	2026-07-03 21:19:26.625534	t	2022-12-20	f	\N	R23/7935	JAGDISH SARAN	\N	C-3	3/NA	2022-12-20	f
960	R23/8189	ASHVANI KUMAR	XXXX-XX-4940	\N	3	\N	223	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.628038	2026-07-03 21:19:26.628038	t	2022-07-23	f	\N	R23/8189	RAM AUTAR SHARMA	223	C-3	3/NA	2022-07-23	f
961	R23/6684	GAYANENDRA KUMAR BAJPAI	XXXX-XX-5255	\N	3	\N	224	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.631005	2026-07-03 21:19:26.631005	f	\N	f	\N	R23/6684	PUSUSHOTTAM LAL BAJPAI	\N	C-3	3/NA	\N	f
962	R23/3265	PARAS SHARMA	XXXX-XX-6452	\N	3	\N	225	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.6337	2026-07-03 21:19:26.6337	t	2023-12-23	f	\N	R23/3265	LATE PRAMOD SHARMA	225	C-3	3/NA	2023-12-23	f
963	R23/7950	PAVAN KUMAR AGARWAL	\N	\N	3	\N	226	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.636601	2026-07-03 21:19:26.636601	t	2021-08-20	f	\N	R23/7950	\N	CHANDRA PRAKASH GUPTA	C-3	3/NA	2021-08-20	f
964	R23/7951	POOJA SINGH SMT	XXXX-XX-9625	\N	3	\N	227	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.639099	2026-07-03 21:19:26.639099	t	2012-03-30	f	\N	R23/7951	\N	\N	C-3	3/NA	2012-03-30	f
965	R23/7952	MAMTA VERMA MISS	\N	\N	3	\N	228	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.642049	2026-07-03 21:19:26.642049	t	2022-05-18	f	\N	R23/7952	DEVENDRA SWAROOP VERMA	\N	C-3	3/NA	2022-05-18	f
966	R23/7960	JYOTI BHATIA	XXXX-XX-3759	\N	3	\N	229	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.644716	2026-07-03 21:19:26.644716	t	2012-03-29	f	\N	R23/7960	\N	\N	C-3	3/NA	2012-03-29	f
967	R23/8219	AJAY KUMAR	XXXX-XX-8473	\N	3	\N	23	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.647498	2026-07-03 21:19:26.647498	t	2023-09-23	f	\N	R23/8219	GOKIL RAM	\N	C-3	3/NA	2023-09-23	f
968	R23/7961	SAURABH PANDEY	XXXX-XX-0954	\N	3	\N	230	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.650216	2026-07-03 21:19:26.650216	t	2014-03-25	f	\N	R23/7961	BHASKAR CHAND PANDEY	\N	C-3	3/N.A.	2014-03-25	f
969	R23/7962	ANITA SINGHAL	XXXX-XX-1605	\N	3	\N	231	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.653225	2026-07-03 21:19:26.653225	t	2019-09-02	f	\N	R23/7962	\N	\N	C-3	3/NA	2019-09-02	f
970	R23/7964	SHASHI BALA SAXENA	XXXX-XX-0694	\N	3	\N	232	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.656255	2026-07-03 21:19:26.656255	t	2012-03-29	f	\N	R23/7964	\N	\N	C-3	3/NA	2012-03-29	f
971	R23/9457	RAJESH SINGH	\N	\N	3	\N	233	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.659117	2026-07-03 21:19:26.659117	t	2019-12-17	f	\N	R23/9457	RAMAN	\N	C-3	3/NA	2019-12-17	f
972	R23/9458	PAWAN KUMAR GOYAL	\N	\N	3	\N	234	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.661909	2026-07-03 21:19:26.661909	t	2022-07-29	f	\N	R23/9458	ANAND PRAKASH GOYAL	\N	C-3	3/NA	2022-07-29	f
973	R23/9461	RAJNEESH KALRA	\N	\N	3	\N	235	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.664684	2026-07-03 21:19:26.664684	t	2015-06-05	f	\N	R23/9461	R P KALRA	\N	C-3	3/NA	2015-06-05	f
974	R23/6685	JANKI PRASAD	XXXX-XX-0982	\N	3	\N	236	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.66793	2026-07-03 21:19:26.66793	f	\N	f	\N	R23/6685	NIRANJAN PRASAD	\N	C-3	3/NA	\N	f
975	R23/9462	MUNISH KUMAR	\N	\N	3	\N	238	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.67071	2026-07-03 21:19:26.67071	t	2020-12-08	f	\N	R23/9462	KUNDAN LAL	\N	C-3	3/NA	2020-12-08	f
976	R23/6686	SWATI AGARWAL KM	XXXX-XX-7831	\N	3	\N	239	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.67337	2026-07-03 21:19:26.67337	t	2025-06-06	f	\N	R23/6686	\N	\N	C-3	3/N.A.	2025-06-06	f
977	R23/9070	KRISHAN KUMAR VERMA	\N	\N	3	\N	24	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.676489	2026-07-03 21:19:26.676489	t	2018-01-11	f	\N	R23/9070	DRAM KUMAR VERMA	\N	C-3	3/NA	2018-01-11	f
978	R23/9144	JANARDAN BABU SHARMA, MAMTA SHARMA	\N	\N	3	\N	240	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.679312	2026-07-03 21:19:26.679312	t	2018-06-27	f	\N	R23/9144	KALI RAM	\N	C-3	3/NA	2018-06-27	f
979	R23/9464	RAJAT VARSHNEY	\N	\N	3	\N	241	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.682313	2026-07-03 21:19:26.682313	t	2014-06-28	f	\N	R23/9464	RAKESH KUMAR	\N	C-3	3/NA	2014-06-28	f
980	R23/9465	NEERAJ KUMAR	XXXX-XX-1691	\N	3	\N	242	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.685258	2026-07-03 21:19:26.685258	t	2017-09-26	f	\N	R23/9465	GANGA RAM	\N	C-3	3/NA	2017-09-26	f
981	R23/8190	ANKIT RATHI	XXXX-XX-0645	\N	3	\N	243	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.68868	2026-07-03 21:19:26.68868	t	2023-09-20	f	\N	R23/8190	SAMPAT KUMAR RATHI	243	C-3	3/NA	2023-09-20	f
982	R23/6687	SANJEEV SINGH CHAUHAN	XXXX-XX-1744	\N	3	\N	244	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.691326	2026-07-03 21:19:26.691326	f	\N	f	\N	R23/6687	RAM LAXMI MARKET	\N	C-3	3/NA	\N	f
983	R23/8191	BHANWATI	XXXX-XX-0175	\N	3	\N	245	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.694343	2026-07-03 21:19:26.694343	t	2022-06-08	f	\N	R23/8191	\N	\N	C-3	3/NA	2022-06-08	f
984	R23/6683	MAHENDRA PAL SINGH	XXXX-XX-2294	\N	3	\N	246	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.697059	2026-07-03 21:19:26.697059	t	2024-10-15	f	\N	R23/6683	SIYARAM	\N	C-3	3/NA	2024-10-15	f
985	R23/8192	RAMAVTAR	XXXX-XX-7755	\N	3	\N	247	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.69996	2026-07-03 21:19:26.69996	t	2022-06-08	f	\N	R23/8192	BIHARI LAL	247	C-3	3/NA	2022-06-08	f
986	R23/9453	RAM DEVI	XXXX-XX-6851	\N	3	\N	248	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.702741	2026-07-03 21:19:26.702741	t	2025-02-13	f	\N	R23/9453	LATE SIYARAM	\N	C-3	3/NA	2025-02-13	f
987	R23/9467	SANJEEV KALARA	\N	\N	3	\N	249	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.705923	2026-07-03 21:19:26.705923	t	2021-03-06	f	\N	R23/9467	\N	\N	C-3	3/NA	2021-03-06	f
988	R23/9071	NANDNI GUPTA	\N	\N	3	\N	25	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.708494	2026-07-03 21:19:26.708494	t	2011-06-18	f	\N	R23/9071	HIANSHU GUPTA	\N	C-3	3/NA	2011-06-18	f
989	R23/9468	RAJPAL KALRA	\N	\N	3	\N	250	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.712355	2026-07-03 21:19:26.712355	t	2012-03-28	f	\N	R23/9468	A P KALRA	\N	C-3	3/NA	2012-03-28	f
990	R23/6689	SUPREET KAUR	\N	\N	3	\N	251	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.715043	2026-07-03 21:19:26.715043	f	\N	f	\N	R23/6689	BHAGWANT SINGH BAGGA	\N	C-3	3/NA	\N	f
991	R23/6987	MOHAMMAD IDRES	\N	\N	3	\N	252	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.717661	2026-07-03 21:19:26.717661	f	\N	f	\N	R23/6987	\N	\N	C-3	3/NA	\N	f
992	R23/9129	POONAM ARORA	\N	\N	3	\N	253	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.720154	2026-07-03 21:19:26.720154	t	2012-02-16	f	\N	R23/9129	SATISH CHANDRA ARORA	\N	C-3	3/NA	2012-02-16	f
993	R23/8056	SUMBUL YASMEEN	\N	\N	3	\N	254	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.723029	2026-07-03 21:19:26.723029	t	2017-03-07	f	\N	R23/8056	\N	\N	C-3	3/NA	2017-03-07	f
994	R23/6690	ZULFIKAR ALI KHAN	\N	\N	3	\N	255	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.725661	2026-07-03 21:19:26.725661	f	\N	f	\N	R23/6690	SIFAT ALI KHAN	\N	C-3	3/NA	\N	f
1047	R23/8100	NEELA JHA	\N	\N	3	\N	300	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.878895	2026-07-03 21:19:26.878895	t	2008-12-08	f	\N	R23/8100	\N	\N	C-3	3/NA	2008-12-08	f
995	R23/10769	SANJEEV JINDAL	\N	\N	3	\N	256	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.730504	2026-07-03 21:19:26.730504	t	2024-09-20	f	\N	R23/10769	BISHAN KUMAR JINDAL	\N	C-3	3/NA	2024-09-20	f
996	R23/8057	SURENDRA SINGH BISHT	\N	\N	3	\N	257	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.733262	2026-07-03 21:19:26.733262	t	2010-03-22	f	\N	R23/8057	MADAN SINGH	\N	C-3	3/NA	2010-03-22	f
997	R23/9228	POOJA MAHESHWARI	\N	\N	3	\N	258	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.736087	2026-07-03 21:19:26.736087	t	2009-02-21	f	\N	R23/9228	DHARMENDRA MAHENSHWARI	\N	C-3	3/NA	2009-02-21	f
998	R23/8058	NEERAJ KUMAR SAXENA	\N	\N	3	\N	259	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.73873	2026-07-03 21:19:26.73873	t	2009-12-10	f	\N	R23/8058	SHYAM BAHADUR SAXENA	\N	C-3	3/NA	2009-12-10	f
999	R23/6672	ANURAG NAGPAL	XXXX-XX-5107	\N	3	\N	26	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.741621	2026-07-03 21:19:26.741621	f	\N	f	\N	R23/6672	JOFINDER NAGPAL	\N	C-3	3/NA	\N	f
1000	R23/8059	VINOD KUMAR SINGH	\N	\N	3	\N	260	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.744428	2026-07-03 21:19:26.744428	t	2012-08-02	f	\N	R23/8059	CHANDRIKA PRASAD SINGH	\N	C-3	3/NA	2012-08-02	f
1001	R23/8060	GIRISH CHANDRA	\N	\N	3	\N	261	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.747377	2026-07-03 21:19:26.747377	t	2011-09-27	f	\N	R23/8060	OM PRAKASH	\N	C-3	3/NA	2011-09-27	f
1002	R23/8061	GIRISH CHANDRA AGARWAL	\N	\N	3	\N	262	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.750433	2026-07-03 21:19:26.750433	t	2017-12-29	f	\N	R23/8061	\N	RAM MURTI LAL	C-3	3/NA	2017-12-29	f
1003	R23/8063	MANJU KHANDELWAL	\N	\N	3	\N	263	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.753383	2026-07-03 21:19:26.753383	t	2010-03-26	f	\N	R23/8063	\N	\N	C-3	3/NA	2010-03-26	f
1004	R23/8064	ARCHANA SHUKLA	\N	\N	3	\N	264	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.756769	2026-07-03 21:19:26.756769	t	2019-11-06	f	\N	R23/8064	\N	\N	C-3	3/NA	2019-11-06	f
1005	R23/8065	DHARM DEEPAK	\N	\N	3	\N	265	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.75938	2026-07-03 21:19:26.75938	t	2019-11-08	f	\N	R23/8065	VIJAY KUMAR KHARE	\N	C-3	3/NA	2019-11-08	f
1006	R23/8066	AMIT AGARWAL	\N	\N	3	\N	266	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.762112	2026-07-03 21:19:26.762112	t	2014-04-09	f	\N	R23/8066	K M AGARWAL	\N	C-3	3/NA	2014-04-09	f
1007	R23/8067	LOKESH AGARWAL	\N	\N	3	\N	267	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.764864	2026-07-03 21:19:26.764864	t	2019-11-12	f	\N	R23/8067	RAJENDRA PRASAD	\N	C-3	3/NA	2019-11-12	f
1008	R23/8068	ARTI JAISWAL	\N	\N	3	\N	268	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.76761	2026-07-03 21:19:26.76761	t	2008-12-12	f	\N	R23/8068	\N	\N	C-3	3/NA	2008-12-12	f
1009	R23/8217	SANGEETA KASHYAP	\N	\N	3	\N	269	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.770114	2026-07-03 21:19:26.770114	t	2008-08-30	f	\N	R23/8217	\N	269	C-3	3/NA	2008-08-30	f
1010	R23/9073	SUNEEL KUMAR GUPTA	\N	\N	3	\N	27	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.773082	2026-07-03 21:19:26.773082	t	2009-12-07	f	\N	R23/9073	R N GUPTA	\N	C-3	3/NA	2009-12-07	f
1011	R23/8069	DHARMESH RATHAUR	\N	\N	3	\N	270	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.776313	2026-07-03 21:19:26.776313	t	2010-08-23	f	\N	R23/8069	CHANDAR PAL RATHAUR	\N	C-3	3/NA	2010-08-23	f
1012	R23/8193	HIMA SAHAI	\N	\N	3	\N	271	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.779046	2026-07-03 21:19:26.779046	t	2010-12-16	f	\N	R23/8193	ANUJ KUMAR	271	C-3	3/NA	2010-12-16	f
1013	R23/8070	B C PANDEY	\N	\N	3	\N	272	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.781739	2026-07-03 21:19:26.781739	t	2009-10-29	f	\N	R23/8070	L D PANDEY	\N	C-3	3/NA	2009-10-29	f
1014	R23/8071	RAJPAL	\N	\N	3	\N	273	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.784406	2026-07-03 21:19:26.784406	t	2012-01-30	f	\N	R23/8071	UMMAR	\N	C-3	3/NA	2012-01-30	f
1015	R23/8072	ANOOP SINGH	\N	\N	3	\N	274	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.787085	2026-07-03 21:19:26.787085	t	2008-12-27	f	\N	R23/8072	RAM CHANDRA	\N	C-3	3/NA	2008-12-27	f
1016	R23/8073	REKHA AGARWAL	\N	\N	3	\N	275	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.789794	2026-07-03 21:19:26.789794	t	2009-12-11	f	\N	R23/8073	SHYAM SUNDER AGARWAL	\N	C-3	3/NA	2009-12-11	f
1017	R23/8074	MANOJ KUMAR GUPTA	\N	\N	3	\N	276	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.792674	2026-07-03 21:19:26.792674	t	2010-05-05	f	\N	R23/8074	NATTHULAL GUPTA	\N	C-3	3/NA	2010-05-05	f
1018	R23/8075	SARAN PAL SINGH	\N	\N	3	\N	277	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.795542	2026-07-03 21:19:26.795542	t	2010-07-15	f	\N	R23/8075	GURCHARAN SINGH	\N	C-3	3/NA	2010-07-15	f
1019	R23/8076	DINESH CHANDA SHARMA	XXXX-XX-7625	\N	3	\N	278	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.799028	2026-07-03 21:19:26.799028	t	2021-12-07	f	\N	R23/8076	MAHESH CHANDRA SHARMA	\N	C-3	3/NA	2021-12-07	f
1020	R23/8077	SWARNESH PATHAK	\N	\N	3	\N	278A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.801641	2026-07-03 21:19:26.801641	t	2018-06-27	f	\N	R23/8077	C M PATHAK	\N	C-3	3/NA	2018-06-27	f
1021	R23/8078	TAPASWINI MISHRA	XXXX-XX-0478	\N	3	\N	279	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.805705	2026-07-03 21:19:26.805705	t	2019-08-31	f	\N	R23/8078	BISHNU PRASAD MISHRA	\N	C-3	3/NA	2019-08-31	f
1022	R23/8079	SUDHA BALA AGARWAL	\N	\N	3	\N	279A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.808288	2026-07-03 21:19:26.808288	t	2019-04-26	f	\N	R23/8079	\N	\N	C-3	3/NA	2019-04-26	f
1023	R23/9076	MEERA AGARWAL A	\N	\N	3	\N	28	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.811345	2026-07-03 21:19:26.811345	t	2018-05-02	f	\N	R23/9076	KRISHAN AGARWAL	\N	C-3	3/NA	2018-05-02	f
1024	R23/9140	DINESH KUMAR	\N	\N	3	\N	280	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.813974	2026-07-03 21:19:26.813974	t	2021-09-04	f	\N	R23/9140	SHIV CHARN DASS	\N	C-3	3/NA	2021-09-04	f
1025	R23/8080	PDADEEP NARIAN SAXENA	\N	\N	3	\N	281	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.816751	2026-07-03 21:19:26.816751	t	2008-05-13	f	\N	R23/8080	PREM NARIAN SAXENA	\N	C-3	3/NA	2008-05-13	f
1026	R23/8081	NEETU	\N	\N	3	\N	282	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.819222	2026-07-03 21:19:26.819222	t	2008-08-23	f	\N	R23/8081	\N	\N	C-3	3/NA	2008-08-23	f
1027	R23/8194	MANOJ KUMAR	\N	\N	3	\N	283	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.821711	2026-07-03 21:19:26.821711	t	2018-05-05	f	\N	R23/8194	HARISH CHNDRA SAXENA	283	C-3	3/NA	2018-05-05	f
1028	R23/9142	ATUL KUMAR SHARMA	\N	\N	3	\N	284	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.8261	2026-07-03 21:19:26.8261	t	2021-02-18	f	\N	R23/9142	LAXMI NARAYAN SHARMA	\N	C-3	3/NA	2021-02-18	f
1029	R23/8082	RADHA RAMAN GIRI	\N	\N	3	\N	285	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.829682	2026-07-03 21:19:26.829682	t	2008-08-25	f	\N	R23/8082	SHAWGRAM GIRI	\N	C-3	3/NA	2008-08-25	f
1030	R23/8083	AMIT AGARWAL	\N	\N	3	\N	286	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.832368	2026-07-03 21:19:26.832368	t	2019-11-01	f	\N	R23/8083	ASHOK KUMAR AGARWAL	\N	C-3	3/NA	2019-11-01	f
1031	R23/8084	JITENDRA KUMAR AGARWAL	\N	\N	3	\N	287	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.835383	2026-07-03 21:19:26.835383	t	2009-05-19	f	\N	R23/8084	LALA LALLO MALJI	\N	C-3	3/NA	2009-05-19	f
1032	R23/8085	RAJEEV GUPTA	\N	\N	3	\N	288	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.837829	2026-07-03 21:19:26.837829	t	2009-03-31	f	\N	R23/8085	RAMMURTI GUPTA	\N	C-3	3/NA	2009-03-31	f
1033	R23/8086	NAVNIT KUMAR SAXENA	\N	\N	3	\N	289	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.840511	2026-07-03 21:19:26.840511	t	2008-09-09	f	\N	R23/8086	SIDH NATH SAXENA	\N	C-3	3/NA	2008-09-09	f
1034	R23/9078	SATYANARAYAN SHARMA	\N	\N	3	\N	29	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.843402	2026-07-03 21:19:26.843402	t	2014-02-05	f	\N	R23/9078	YADRAM SHARMA	\N	C-3	3/NA	2014-02-05	f
1035	R23/8087	NISHANT SANTOSHI	\N	\N	3	\N	290	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.846845	2026-07-03 21:19:26.846845	t	2008-12-29	f	\N	R23/8087	MAHESH CHANDRA SA	\N	C-3	3/NA	2008-12-29	f
1036	R23/8094	GEETA DEVI, SANJAY SINGH	\N	\N	3	\N	291	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.849429	2026-07-03 21:19:26.849429	t	2008-08-20	f	\N	R23/8094	\N	\N	C-3	3/NA	2008-08-20	f
1037	R23/8095	VIKAS CHANDRA	\N	\N	3	\N	292	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.852207	2026-07-03 21:19:26.852207	t	2012-03-31	f	\N	R23/8095	RAM KHILAWAN	\N	C-3	3/NA	2012-03-31	f
1038	R23/8096	VIDUSHI RATHORE	\N	\N	3	\N	293	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.854914	2026-07-03 21:19:26.854914	t	2008-06-09	f	\N	R23/8096	\N	\N	C-3	3/NA	2008-06-09	f
1039	R23/8097	TULA RAM	\N	\N	3	\N	294	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.858045	2026-07-03 21:19:26.858045	t	2019-09-30	f	\N	R23/8097	MUNNA LAL	\N	C-3	3/NA	2019-09-30	f
1040	R23/8098	RITESH AGARWAL	\N	\N	3	\N	295	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.86069	2026-07-03 21:19:26.86069	t	2012-03-28	f	\N	R23/8098	SURESH CHANDRA AGARWAL	\N	C-3	3/NA	2012-03-28	f
1041	R23/8195	UMAKANT BHARDWAJ	\N	\N	3	\N	296	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.863327	2026-07-03 21:19:26.863327	t	2008-08-30	f	\N	R23/8195	DATA RAM BHARDWAJ	\N	C-3	3/NA	2008-08-30	f
1042	R23/9156	RACHIT BANSAL	\N	\N	3	\N	297	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.865907	2026-07-03 21:19:26.865907	t	2008-08-23	f	\N	R23/9156	SINESH CHANDRA	\N	C-3	3/NA	2008-08-23	f
1043	R23/8099	MOHAMMAD TARIQ QURASHI	\N	\N	3	\N	298	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.868702	2026-07-03 21:19:26.868702	t	2008-03-29	f	\N	R23/8099	MOHAMMAD LEEQ QURAISHI	\N	C-3	3/NA	2008-03-29	f
1044	R23/9157	KRISHNA DEVI	\N	\N	3	\N	299	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.87138	2026-07-03 21:19:26.87138	t	2019-01-22	f	\N	R23/9157	P D AGARWAL	\N	C-3	3/NA	2019-01-22	f
1045	R23/9058	ABHISHEK SHARMA	\N	\N	3	\N	3	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.874152	2026-07-03 21:19:26.874152	t	2021-02-09	f	\N	R23/9058	RAJENDRA PRASAD SHARMA	\N	C-3	3/NA	2021-02-09	f
1046	R23/9079	MAHENDRA PRAKASH DWIVEDI	\N	\N	3	\N	30	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.876406	2026-07-03 21:19:26.876406	t	2018-04-09	f	\N	R23/9079	MATAPHER DWIVEDI	\N	C-3	3/NA	2018-04-09	f
1048	R23/8101	RACHNA AGARWAL	\N	\N	3	\N	301	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.88121	2026-07-03 21:19:26.88121	t	2009-06-19	f	\N	R23/8101	\N	\N	C-3	3/NA	2009-06-19	f
1049	R23/8102	MADHU GARG	\N	\N	3	\N	302	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.884168	2026-07-03 21:19:26.884168	t	2009-02-10	f	\N	R23/8102	\N	\N	C-3	3/NA	2009-02-10	f
1050	R23/8103	PALLAVI AGARWAL	\N	\N	3	\N	303	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.887793	2026-07-03 21:19:26.887793	t	2011-05-13	f	\N	R23/8103	\N	\N	C-3	3/NA	2011-05-13	f
1051	R23/9143	UTTAM KUMAR AGARWAL A	\N	\N	3	\N	304	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.890745	2026-07-03 21:19:26.890745	t	2022-05-06	f	\N	R23/9143	RAJESHWAR PRASAD AGR	\N	C-3	3/NA	2022-05-06	f
1052	R23/8104	PRADEEP KUMAR GANGWAR	\N	\N	3	\N	305	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.893791	2026-07-03 21:19:26.893791	t	2009-12-10	f	\N	R23/8104	ROSHAN LAL GANGWAR	\N	C-3	3/NA	2009-12-10	f
1053	R23/8105	SIMMY ARORA	\N	\N	3	\N	306	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.896327	2026-07-03 21:19:26.896327	t	2008-05-15	f	\N	R23/8105	\N	\N	C-3	3/NA	2008-05-15	f
1054	R23/8106	PRADEEP KUMAR VIJ	\N	\N	3	\N	307	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.898683	2026-07-03 21:19:26.898683	t	2021-08-03	f	\N	R23/8106	\N	\N	C-3	3/NA	2021-08-03	f
1055	R23/8107	MANJEET SINGH KHURANA	\N	\N	3	\N	308	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.901133	2026-07-03 21:19:26.901133	t	2010-05-14	f	\N	R23/8107	NANAK SINGH	\N	C-3	3/NA	2010-05-14	f
1056	R23/6990	NAZIS BI	\N	\N	3	\N	309	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.907047	2026-07-03 21:19:26.907047	f	\N	f	\N	R23/6990	HABIV ULLAH ANSAR	\N	C-3	3/NA	\N	f
1057	R23/9080	RAVI SHANKAR	\N	\N	3	\N	31	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.909429	2026-07-03 21:19:26.909429	t	2012-03-31	f	\N	R23/9080	MOHAN LAL	\N	C-3	3/NA	2012-03-31	f
1058	R23/8109	LALIT KUMAR GANGWAR	\N	\N	3	\N	310	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.912277	2026-07-03 21:19:26.912277	t	2011-06-10	f	\N	R23/8109	J L GANGWAR	\N	C-3	3/NA	2011-06-10	f
1059	R23/8111	SNEH LATA SAXENA	\N	\N	3	\N	311	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.91494	2026-07-03 21:19:26.91494	t	2009-12-30	f	\N	R23/8111	LATE SURENDRA NATH SAXENA	\N	C-3	3/NA	2009-12-30	f
1060	R23/9146	BEAUTY GUPTA AND BRIJESH KUMAR	\N	\N	3	\N	312	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.917692	2026-07-03 21:19:26.917692	t	2010-11-23	f	\N	R23/9146	RAJENDRA SING	\N	C-3	3/NA	2010-11-23	f
1061	R23/8112	RAJEEV KUMA GUPTA	\N	\N	3	\N	313	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.920424	2026-07-03 21:19:26.920424	t	2012-03-31	f	\N	R23/8112	SRI JAGDISH SARAN GUPTA	\N	C-3	3/NA	2012-03-31	f
1062	R23/8113	HETRAM VERMA	\N	\N	3	\N	314	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.92267	2026-07-03 21:19:26.92267	t	2012-03-31	f	\N	R23/8113	\N	\N	C-3	3/NA	2012-03-31	f
1063	R23/8114	SUMIT AGARWAL	\N	\N	3	\N	315	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.92516	2026-07-03 21:19:26.92516	t	2022-07-22	f	\N	R23/8114	ASHOK AGARWAL	\N	C-3	3/NA	2022-07-22	f
1064	R23/8115	RAJEEV KUMAR GUPTA	XXXX-XX-7772	\N	3	\N	316	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.928003	2026-07-03 21:19:26.928003	t	2019-07-15	f	\N	R23/8115	R A GUPTA	\N	C-3	3/NA	2019-07-15	f
1065	R23/8116	SACHIN AGARWAL	XXXX-XX-0620	\N	3	\N	317	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.931656	2026-07-03 21:19:26.931656	t	2019-07-12	f	\N	R23/8116	AKHILESH AGARWAL	\N	C-3	3/NA	2019-07-12	f
1066	R23/9470	SUSHIL DEBEY	XXXX-XX-1760	\N	3	\N	318	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.93446	2026-07-03 21:19:26.93446	t	2022-11-22	f	\N	R23/9470	RAMESH CHANDARA DUBEY	\N	C-3	3/NA	2022-11-22	f
1067	R23/10772	Vacant	\N	\N	3	\N	319	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.937203	2026-07-03 21:19:26.937203	f	\N	f	\N	R23/10772	\N	319	C-3	3/NA	\N	f
1068	R23/9081	RAJEEV PATHAK	\N	\N	3	\N	32	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.939881	2026-07-03 21:19:26.939881	t	2012-01-28	f	\N	R23/9081	RATAN PAL SHARM A	\N	C-3	3/NA	2012-01-28	f
1069	R23/8117	BALBIR KUMAR	XXXX-XX-7778	\N	3	\N	320	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.942784	2026-07-03 21:19:26.942784	t	2021-10-27	f	\N	R23/8117	RAM BHAROSEY LAL	\N	C-3	3/NA	2021-10-27	f
1070	R23/8118	DEV KUMAR	XXXX-XX-6415	\N	3	\N	321	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.945674	2026-07-03 21:19:26.945674	t	2019-12-03	f	\N	R23/8118	VISHRAM LAL	\N	C-3	3/NA	2019-12-03	f
1071	R23/8196	SON DEVI	XXXX-XX-1511	\N	3	\N	322	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.948372	2026-07-03 21:19:26.948372	t	2022-08-06	f	\N	R23/8196	\N	322	C-3	3/NA	2022-08-06	f
1072	R23/8119	PUSHPA DEVI	\N	\N	3	\N	323	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.950978	2026-07-03 21:19:26.950978	t	2018-04-05	f	\N	R23/8119	SOHAN LAL	\N	C-3	3/NA	2018-04-05	f
1073	R23/8120	SARWATI SHARMA	XXXX-XX-8091	\N	3	\N	324	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.953708	2026-07-03 21:19:26.953708	t	2018-04-05	f	\N	R23/8120	RAMAUTAR SHARMA	\N	C-3	3/NA	2018-04-05	f
1074	R23/8180	VIKAS RASTOGI	XXXX-XX-2278	\N	3	\N	325	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.956497	2026-07-03 21:19:26.956497	t	2023-06-13	f	\N	R23/8180	A K RASTOGI	\N	C-3	3/NA	2023-06-13	f
1075	R23/8181	SHISHUPAL	XXXX-XX-8878	\N	3	\N	326	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.959526	2026-07-03 21:19:26.959526	t	2024-02-08	f	\N	R23/8181	DATA RAM	326	C-3	3/NA	2024-02-08	f
1076	R23/8177	SANTOSH SINGH RAWAT	XXXX-XX-9920	\N	3	\N	327	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.962235	2026-07-03 21:19:26.962235	t	2023-05-06	f	\N	R23/8177	PANCHAM SINGH RAWAT	327	C-3	3/NA	2023-05-06	f
1077	R23/8225	S S GUPTA	XXXX-XX-4117	\N	3	\N	328	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.964931	2026-07-03 21:19:26.964931	t	2022-12-03	f	\N	R23/8225	RD GUPTA	328	C-3	3/NA	2022-12-03	f
1078	R23/8197	SHEETAL GANGWAR	XXXX-XX-2888	\N	3	\N	329	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.967561	2026-07-03 21:19:26.967561	t	2023-09-23	f	\N	R23/8197	RAJIV KUMAR GANGWAR	329	C-3	3/NA	2023-09-23	f
1079	R23/9082	SHAHEEN AKBAR ANSARI	\N	\N	3	\N	33	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.970283	2026-07-03 21:19:26.970283	t	2022-02-22	f	\N	R23/9082	SHAPIQ AHMAD	\N	C-3	3/NA	2022-02-22	f
1080	R23/8198	MAYA DEVI	XXXX-XX-5551	\N	3	\N	330	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.973126	2026-07-03 21:19:26.973126	t	2022-12-17	f	\N	R23/8198	SUBHASH CHANDRA	330	C-3	3/NA	2022-12-17	f
1081	R23/5143	SUDHIR SINGH	\N	\N	3	\N	333	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.97593	2026-07-03 21:19:26.97593	t	2024-11-21	f	\N	R23/5143	\N	333	C-3	3/NA	2024-11-21	f
1082	R23/8215	PHOOL SETH	XXXX-XX-1673	\N	3	\N	334	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.978376	2026-07-03 21:19:26.978376	t	2023-01-19	f	\N	R23/8215	\N	334	C-3	3/NA	2023-01-19	f
1083	R23/8199	SHALENDRA KUMAR	XXXX-XX-5152	\N	3	\N	335	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.981619	2026-07-03 21:19:26.981619	t	2023-05-30	f	\N	R23/8199	BATTI RAM	\N	C-3	3/NA	2023-05-30	f
1084	R23/8200	CHETAN KHULWAY	XXXX-XX-3463	\N	3	\N	336	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.983974	2026-07-03 21:19:26.983974	t	2022-08-05	f	\N	R23/8200	THAKUR DUTT KHULWAY	336	C-3	3/NA	2022-08-05	f
1085	R23/9108	JEEVAN CHANDDRA	XXXX-XX-0571	\N	3	\N	337	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.986586	2026-07-03 21:19:26.986586	t	2022-11-22	f	\N	R23/9108	CHANDRA SHEKAR	\N	C-3	3/NA	2022-11-22	f
1086	R23/3223	RACHNA RANI	XXXX-XX-6701	\N	3	\N	338	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.989189	2026-07-03 21:19:26.989189	t	2024-06-15	f	\N	R23/3223	\N	338	C-3	3/NA	2024-06-15	f
1087	R23/6691	PARUL CHADHARI	XXXX-XX-7468	\N	3	\N	339	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.991778	2026-07-03 21:19:26.991778	f	\N	f	\N	R23/6691	\N	\N	C-3	3/NA	\N	f
1088	R23/10767	ASHOK KUMAR GARG	\N	\N	3	\N	34	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.994363	2026-07-03 21:19:26.994363	t	2010-07-13	f	\N	R23/10767	SATISH CHANDRA GARG	\N	C-3	3/NA	2010-07-13	f
1089	R23/3198	ANUPAMA AGARWAL	XXXX-XX-5369	\N	3	\N	340	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.997	2026-07-03 21:19:26.997	t	2024-03-02	f	\N	R23/3198	\N	9634155369	C-3	3/NA	2024-03-02	f
1090	R23/8212	SHIV KUMAR	XXXX-XX-6597	\N	3	\N	341	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:26.999663	2026-07-03 21:19:26.999663	t	2023-01-12	f	\N	R23/8212	CHOKHE LAL	341	C-3	3/NA	2023-01-12	f
1091	R23/6699	KRISHAN KUMAR SHARMA	XXXX-XX-2975	\N	3	\N	342	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.002404	2026-07-03 21:19:27.002404	f	\N	f	\N	R23/6699	RAM KRIPAL SHARAMA	\N	C-3	3/NA	\N	f
1092	R23/3233	RADHA	XXXX-XX-9386	\N	3	\N	343	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.005177	2026-07-03 21:19:27.005177	t	2024-06-15	f	\N	R23/3233	\N	343	C-3	3/NA	2024-06-15	f
1093	R23/8121	NEERAJ SINGHAL	XXXX-XX-6712	\N	3	\N	344	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.007834	2026-07-03 21:19:27.007834	t	2022-08-05	f	\N	R23/8121	MAHENDRA PRATAP	\N	C-3	3/NA	2022-08-05	f
1094	R23/10773	Vacant	\N	\N	3	\N	345	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.010436	2026-07-03 21:19:27.010436	f	\N	f	\N	R23/10773	\N	345	C-3	3/NA	\N	f
1095	R23/4241	VIJAY KUMAR TALWANI	XXXX-XX-2103	\N	3	\N	346	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.013652	2026-07-03 21:19:27.013652	t	2024-09-13	f	\N	R23/4241	PRATAP RAI TALWANI	346	C-3	3/NA	2024-09-13	f
1096	R23/8226	MOHD ZAFAR	XXXX-XX-9670	\N	3	\N	347	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.016231	2026-07-03 21:19:27.016231	t	2023-09-23	f	\N	R23/8226	MOHD HANEEF	\N	C-3	3/NA	2023-09-23	f
1097	R23/9145	KIRTI SAXENA	\N	\N	3	\N	348	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.018745	2026-07-03 21:19:27.018745	t	2011-03-05	f	\N	R23/9145	\N	\N	C-3	3/NA	2011-03-05	f
1098	R23/8122	PANKAJ KUMAR SINDAL	\N	\N	3	\N	349	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.021584	2026-07-03 21:19:27.021584	t	2008-12-28	f	\N	R23/8122	B D GUPTA	\N	C-3	3/NA	2008-12-28	f
1099	R23/9083	VISHAL GUPTA	\N	\N	3	\N	35	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.024247	2026-07-03 21:19:27.024247	t	2015-06-27	f	\N	R23/9083	P S BHARTI	\N	C-3	3/NA	2015-06-27	f
735	R23/10764	Vacant	\N	\N	3	\N	418	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:25.966989	2026-07-03 21:19:25.966989	f	\N	f	\N	R23/10764	\N	418	C-2	3/--Select--	\N	f
1100	R23/8178	MENKA SURI	\N	\N	3	\N	350	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.02697	2026-07-03 21:19:27.02697	t	2023-05-04	f	\N	R23/8178	PAWAN KUMAR SURI	350	C-3	3/NA	2023-05-04	f
1101	R23/6712	MOHD WASEEM	\N	\N	3	\N	351	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.029794	2026-07-03 21:19:27.029794	f	\N	f	\N	R23/6712	MOHD UMAR	\N	C-3	3/NA	\N	f
1102	R23/8123	NEERAJ KUMAR CHANDRA	\N	\N	3	\N	352	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.032735	2026-07-03 21:19:27.032735	t	2011-04-15	f	\N	R23/8123	SHANKAR LAL	\N	C-3	3/NA	2011-04-15	f
1103	R23/8124	LAKH RAJ	\N	\N	3	\N	353	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.03521	2026-07-03 21:19:27.03521	t	2009-12-05	f	\N	R23/8124	PARVAT RAM MAURYA	\N	C-3	3/NA	2009-12-05	f
1104	R23/8125	KUSUM RANI	\N	\N	3	\N	354	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.037871	2026-07-03 21:19:27.037871	t	2010-03-31	f	\N	R23/8125	\N	\N	C-3	3/NA	2010-03-31	f
1105	R23/8126	AJAY BHARTI	\N	\N	3	\N	355	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.041033	2026-07-03 21:19:27.041033	t	2011-06-19	f	\N	R23/8126	PREM VIHARI LAL	\N	C-3	3/NA	2011-06-19	f
1106	R23/8127	URMILA DEVI	\N	\N	3	\N	356	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.044012	2026-07-03 21:19:27.044012	t	2012-03-28	f	\N	R23/8127	\N	\N	C-3	3/NA	2012-03-28	f
1107	R23/6991	SNEH AGARWA	\N	\N	3	\N	357	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.046777	2026-07-03 21:19:27.046777	f	\N	f	\N	R23/6991	UTTAM KUMAR AGARWAL	\N	C-3	3/NA	\N	f
1108	R23/8128	NEELAM JAISWAL	\N	\N	3	\N	358	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.049576	2026-07-03 21:19:27.049576	t	2011-01-20	f	\N	R23/8128	\N	\N	C-3	3/NA	2011-01-20	f
1109	R23/9134	SANJAY AGARWAL	\N	\N	3	\N	359	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.052093	2026-07-03 21:19:27.052093	t	2009-09-02	f	\N	R23/9134	NIRANKAR NATH AGARWAL	\N	C-3	3/NA	2009-09-02	f
1110	R23/9084	RUCHI SAXENA	\N	\N	3	\N	36	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.055261	2026-07-03 21:19:27.055261	t	2014-07-30	f	\N	R23/9084	URVESH SAXENA	\N	C-3	3/NA	2014-07-30	f
1111	R23/9154	MUNEER UL HASAN	\N	\N	3	\N	360	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.05816	2026-07-03 21:19:27.05816	t	2018-02-17	f	\N	R23/9154	HABEEB UL HASAN	\N	C-3	3/NA	2018-02-17	f
1112	R23/8129	ASHOK CHANDER BHARTI	\N	\N	3	\N	361	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.060784	2026-07-03 21:19:27.060784	t	2008-12-24	f	\N	R23/8129	VINARILAL SAXENA	\N	C-3	3/NA	2008-12-24	f
1113	R23/8130	NEELAM AGARWAL	\N	\N	3	\N	362	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.063873	2026-07-03 21:19:27.063873	t	2014-01-21	f	\N	R23/8130	\N	\N	C-3	3/NA	2014-01-21	f
1114	R23/8131	MUZAMMIL KHAN	\N	\N	3	\N	363	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.066537	2026-07-03 21:19:27.066537	t	2019-12-27	f	\N	R23/8131	S U KHAN	\N	C-3	3/NA	2019-12-27	f
1115	R23/4242	PARSHURAM	XXXX-XX-3243	\N	3	\N	365	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.069281	2026-07-03 21:19:27.069281	f	\N	f	\N	R23/4242	LEKHRAJ	365	C-3	3/NA	\N	f
1116	R23/4243	ATAR SINGH	XXXX-XX-7131	\N	3	\N	366	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.071599	2026-07-03 21:19:27.071599	f	\N	f	\N	R23/4243	RAKSHA PAL SINGH	366	C-3	3/NA	\N	f
1117	R23/4244	PAVAN KUMAR	XXXX-XX-0755	\N	3	\N	367	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.075178	2026-07-03 21:19:27.075178	f	\N	f	\N	R23/4244	JAI CHAND	367	C-3	3/NA	\N	f
1118	R23/8201	SHIV RAM	XXXX-XX-7611	\N	3	\N	368	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.078096	2026-07-03 21:19:27.078096	t	2022-12-17	f	\N	R23/8201	JAGGU RAM	\N	C-3	3/NA	2022-12-17	f
1119	R23/9139	RAJAT PAL	\N	\N	3	\N	369	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.080987	2026-07-03 21:19:27.080987	t	2023-02-17	f	\N	R23/9139	SATYENDRA KUMAR PAL	\N	C-3	3/NA	2023-02-17	f
1120	R23/9135	PARMESHWARI DEVI	\N	\N	3	\N	37	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.088111	2026-07-03 21:19:27.088111	t	2009-12-10	f	\N	R23/9135	MOHAN LAL	\N	C-3	3/NA	2009-12-10	f
1121	R23/4233	GAURAV SHARMA	XXXX-XX-1729	\N	3	\N	370	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.091364	2026-07-03 21:19:27.091364	t	2024-06-11	f	\N	R23/4233	RAM LAKHAN	370	C-3	3/NA	2024-06-11	f
1122	R23/8208	DEEPAK KUMAR	XXXX-XX-0011	\N	3	\N	371	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.094342	2026-07-03 21:19:27.094342	t	2023-03-25	f	\N	R23/8208	OMKAR	371	C-3	3/NA	2023-03-25	f
1123	R23/8211	RAKESH KUMAR	XXXX-XX-0742	\N	3	\N	372	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.097096	2026-07-03 21:19:27.097096	t	2023-02-07	f	\N	R23/8211	SHARDA PRASAD	372	C-3	3/NA	2023-02-07	f
1124	R23/3201	RAMESH CHANDR	XXXX-XX-8932	\N	3	\N	373	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.100214	2026-07-03 21:19:27.100214	t	2023-10-27	f	\N	R23/3201	RAM AUTAR	373	C-3	3/NA	2023-10-27	f
1125	R23/8132	ATISH KUMAR	XXXX-XX-0412	\N	3	\N	374	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.10324	2026-07-03 21:19:27.10324	t	2022-06-03	f	\N	R23/8132	NARESH KUMAR	\N	C-3	3/NA	2022-06-03	f
1127	R23/8182	BATTI RAM	XXXX-XX-1544	\N	3	\N	376	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.108982	2026-07-03 21:19:27.108982	t	2023-05-06	f	\N	R23/8182	SUKHLAL	376	C-3	3/NA	2023-05-06	f
1128	R23/8133	ANKUR GUPTA	XXXX-XX-7400	\N	3	\N	377	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.111629	2026-07-03 21:19:27.111629	t	2022-08-05	f	\N	R23/8133	KAILASH CHAND GUPTA	\N	C-3	3/NA	2022-08-05	f
1129	R23/8183	KUSUM DEVI	XXXX-XX-5791	\N	3	\N	378	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.114296	2026-07-03 21:19:27.114296	t	2022-12-06	f	\N	R23/8183	SONU SINGH	378	C-3	3/NA	2022-12-06	f
1130	R23/8207	SURENDRA SINGH	XXXX-XX-7600	\N	3	\N	379	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.116984	2026-07-03 21:19:27.116984	t	2023-03-25	f	\N	R23/8207	DORI LAL	379	C-3	3/NA	2023-03-25	f
1131	R23/9085	RAVI GAUTAM	\N	\N	3	\N	38	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.119827	2026-07-03 21:19:27.119827	t	2009-12-17	f	\N	R23/9085	VIRENDRA PAL GAUTAM	\N	C-3	3/NA	2009-12-17	f
1132	R23/3214	ROOPKISHORE SHARMA	XXXX-XX-8451	\N	3	\N	380	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.122436	2026-07-03 21:19:27.122436	t	2024-01-20	f	\N	R23/3214	JAGDISH PRASAD SHARMA	380	C-3	3/NA	2024-01-20	f
1133	R23/9148	BHAHAN LAL	XXXX-XX-8938	\N	3	\N	381	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.125074	2026-07-03 21:19:27.125074	t	2022-12-12	f	\N	R23/9148	RAM LAL	\N	C-3	3/NA	2022-12-12	f
1134	R23/8213	SHANTI PAL	XXXX-XX-3991	\N	3	\N	382	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.128406	2026-07-03 21:19:27.128406	t	2023-01-10	f	\N	R23/8213	CHOKHE LAL	382	C-3	3/NA	2023-01-10	f
1135	R23/8210	DEVAKI VERMA	XXXX-XX-0088	\N	3	\N	383	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.131315	2026-07-03 21:19:27.131315	t	2023-01-10	f	\N	R23/8210	\N	383	C-3	3/NA	2023-01-10	f
1136	R23/8173	SHRI KRISHAN YADAV	XXXX-XX-4330	\N	3	\N	384	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.133979	2026-07-03 21:19:27.133979	t	2022-09-30	f	\N	R23/8173	MAHEEPAL SINGH	384	C-3	3/NA	2022-09-30	f
1137	R23/10770	YOGENDRA KUMAR	\N	\N	3	\N	385	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.136909	2026-07-03 21:19:27.136909	t	2023-10-21	f	\N	R23/10770	SHREE RAM	\N	C-3	3/NA	2023-10-21	f
1138	R23/3202	MEERADEVI	\N	\N	3	\N	386	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.139619	2026-07-03 21:19:27.139619	t	2023-04-03	f	\N	R23/3202	\N	386	C-3	3/NA	2023-04-03	f
1139	R23/4063	UDAI BIR SINGH	XXXX-XX-0927	\N	3	\N	387	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.142435	2026-07-03 21:19:27.142435	t	2023-12-30	f	\N	R23/4063	KRISHNA PAL SINGH	387	C-3	3/N.A.	2023-12-30	f
1140	R23/8134	NISHA	XXXX-XX-3526	\N	3	\N	388	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.145441	2026-07-03 21:19:27.145441	t	2022-07-23	f	\N	R23/8134	THAKRE RANJIT HIVRAJ	\N	C-3	3/NA	2022-07-23	f
1141	R23/8135	SARVESH KUMAR	XXXX-XX-9020	\N	3	\N	389	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.148792	2026-07-03 21:19:27.148792	t	2022-09-06	f	\N	R23/8135	\N	\N	C-3	3/NA	2022-09-06	f
1142	R23/9086	SARAD AGARWAL S	\N	\N	3	\N	39	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.151453	2026-07-03 21:19:27.151453	t	2010-03-28	f	\N	R23/9086	DINESH KUMAR AGARWA	\N	C-3	3/NA	2010-03-28	f
1143	R23/8224	ARJUN SINGH	XXXX-XX-0099	\N	3	\N	390	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.15435	2026-07-03 21:19:27.15435	t	2022-12-26	f	\N	R23/8224	RAM KUMAR VERMA	3390	C-3	3/NA	2022-12-26	f
1144	R23/10775	Vacant	\N	\N	3	\N	391	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.157013	2026-07-03 21:19:27.157013	f	\N	f	\N	R23/10775	\N	391	C-3	3/--Select--	\N	f
1145	R23/8202	ANOOP KUMAR BHARTI	XXXX-XX-7731	\N	3	\N	392	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.160275	2026-07-03 21:19:27.160275	t	2023-05-30	f	\N	R23/8202	VEDPAL	392	C-3	3/NA	2023-05-30	f
1146	R23/9229	ANIL KUMAR	\N	\N	3	\N	393	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.16377	2026-07-03 21:19:27.16377	t	2023-01-19	f	\N	R23/9229	KHAYALI RAM	\N	C-3	3/NA	2023-01-19	f
1147	R23/8203	RAVINDRA NATH DINKAR	XXXX-XX-5705	\N	3	\N	394	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.167064	2026-07-03 21:19:27.167064	t	2022-09-29	f	\N	R23/8203	RAM SEWAK	\N	C-3	3/NA	2022-09-29	f
1148	R23/8174	UMA GOSWANMI	XXXX-XX-3336	\N	3	\N	395	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.170156	2026-07-03 21:19:27.170156	t	2023-05-30	f	\N	R23/8174	\N	395	C-3	3/NA	2023-05-30	f
1149	R23/6714	SHIVAM SHARMA	XXXX-XX-7152	\N	3	\N	396	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.173306	2026-07-03 21:19:27.173306	t	2024-01-04	f	\N	R23/6714	VINAY KUMAR	\N	C-3	3/NA	2024-01-04	f
1150	R23/6716	UMESH SETHI	XXXX-XX-5534	\N	3	\N	397	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.176374	2026-07-03 21:19:27.176374	f	\N	f	\N	R23/6716	KRISHNA BHARAT SETHI	\N	C-3	3/NA	\N	f
1151	R23/8136	OWAIS HUSAIN	\N	\N	3	\N	398	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.17998	2026-07-03 21:19:27.17998	t	2017-08-26	f	\N	R23/8136	ISRAR HUSAIN	\N	C-3	3/NA	2017-08-26	f
1152	R23/8216	NEERU KHANDELWAL	\N	\N	3	\N	399	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.183062	2026-07-03 21:19:27.183062	t	2004-08-25	f	\N	R23/8216	\N	399	C-3	3/NA	2004-08-25	f
1153	R23/9059	NIKHAIL KUMAR KHANDELWAL	XXXX-XX-4900	\N	3	\N	4	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.186183	2026-07-03 21:19:27.186183	t	2018-06-27	f	\N	R23/9059	VIJAY KUMAR KHANDELWAL	\N	C-3	3/NA	2018-06-27	f
1154	R23/9087	VEENA PANI AGARWAL A	\N	\N	3	\N	40	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.188936	2026-07-03 21:19:27.188936	t	2010-03-31	f	\N	R23/9087	VINOD KUMAR AGARWAL	\N	C-3	3/NA	2010-03-31	f
1155	R23/8137	TAJINDER PAL SINGH	\N	\N	3	\N	400	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.191794	2026-07-03 21:19:27.191794	t	2019-12-09	f	\N	R23/8137	VIJAY KUMAR AGARWAL	\N	C-3	3/NA	2019-12-09	f
1156	R23/8138	NAMITA AGARWAL	\N	\N	3	\N	401	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.195056	2026-07-03 21:19:27.195056	t	2008-06-17	f	\N	R23/8138	BRIJESH KUMAR AGARWAL	\N	C-3	3/NA	2008-06-17	f
1157	R23/10776	Vacant	\N	\N	3	\N	402	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.19801	2026-07-03 21:19:27.19801	f	\N	f	\N	R23/10776	\N	402	C-3	3/NA	\N	f
1158	R23/6718	MAHAK AGARWAL	\N	\N	3	\N	403	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.200697	2026-07-03 21:19:27.200697	f	\N	f	\N	R23/6718	\N	\N	C-3	3/NA	\N	f
1159	R23/8139	CAPT G S SAHGAL	\N	\N	3	\N	404	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.203738	2026-07-03 21:19:27.203738	t	2008-07-21	f	\N	R23/8139	AMRIT SAGAR SAHGAL	\N	C-3	3/NA	2008-07-21	f
1160	R23/8140	ARJUN KUMAR AGARWAL	\N	\N	3	\N	405	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.20645	2026-07-03 21:19:27.20645	t	2008-07-26	f	\N	R23/8140	BHAGWAT SARAN AGARWAL	\N	C-3	3/NA	2008-07-26	f
1161	R23/8204	VIRENDRA KUMAR	\N	\N	3	\N	406	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.209235	2026-07-03 21:19:27.209235	t	2024-02-17	f	\N	R23/8204	ASHARFI LAL	406	C-3	3/NA	2024-02-17	f
1162	R23/4416	VIRENDRA KUMAR	\N	\N	3	\N	406	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.211956	2026-07-03 21:19:27.211956	f	\N	f	\N	R23/4416	ASHARFI LAL	406	C-3	3/NA	\N	f
1163	R23/10777	Vacant	\N	\N	3	\N	407	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.214657	2026-07-03 21:19:27.214657	f	\N	f	\N	R23/10777	\N	407	C-3	3/NA	\N	f
1164	R23/9159	RAJENDRA JOSHI	\N	\N	3	\N	408	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.217209	2026-07-03 21:19:27.217209	t	2015-02-05	f	\N	R23/9159	POORAN CHANDRA JOSHI	\N	C-3	3/NA	2015-02-05	f
1165	R23/8141	SANTOSH KUMAR PAL	\N	\N	3	\N	409	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.220156	2026-07-03 21:19:27.220156	t	2021-07-20	f	\N	R23/8141	RAM KIRSHAN PAL	\N	C-3	3/NA	2021-07-20	f
1166	R23/4249	RAJNISH KUMAR GANGWAR	XXXX-XX-1048	\N	3	\N	409A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.224926	2026-07-03 21:19:27.224926	f	\N	f	\N	R23/4249	OMENDRA PAL	409A	C-3	3/NA	\N	f
1167	R23/9088	NAJISH	\N	\N	3	\N	41	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.228337	2026-07-03 21:19:27.228337	t	2021-08-19	f	\N	R23/9088	IKLEEM	\N	C-3	3/NA	2021-08-19	f
1168	R23/8142	SARIKA	\N	\N	3	\N	410	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.23093	2026-07-03 21:19:27.23093	t	2009-08-28	f	\N	R23/8142	\N	\N	C-3	3/NA	2009-08-28	f
1169	R23/8143	MANOJ KUMAR SINGH	\N	\N	3	\N	411	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.234382	2026-07-03 21:19:27.234382	t	2021-07-20	f	\N	R23/8143	ARVIND KUMAR SINGH	\N	C-3	3/NA	2021-07-20	f
1170	R23/8144	GHANSHYAM DASS KATIYAR	\N	\N	3	\N	412	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.237112	2026-07-03 21:19:27.237112	t	2010-09-14	f	\N	R23/8144	DAYARAM	\N	C-3	3/NA	2010-09-14	f
1171	R23/8145	MANOJ KUMAR MISHRA	\N	\N	3	\N	413	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.240444	2026-07-03 21:19:27.240444	t	2009-05-29	f	\N	R23/8145	GIRJA SHANER MISHRA	\N	C-3	3/NA	2009-05-29	f
1172	R23/8146	TRIBHUWAN PURI	\N	\N	3	\N	414	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.243396	2026-07-03 21:19:27.243396	t	2008-12-31	f	\N	R23/8146	VISHWA PAL PURI	\N	C-3	3/NA	2008-12-31	f
1173	R23/8147	KIRANIJ	\N	\N	3	\N	415	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.246656	2026-07-03 21:19:27.246656	t	2009-08-28	f	\N	R23/8147	\N	PRADEEP KUMAR	C-3	3/NA	2009-08-28	f
1174	R23/6719	SANJAY GERA	XXXX-XX-5275	\N	3	\N	416	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.249513	2026-07-03 21:19:27.249513	t	2025-03-07	f	\N	R23/6719	TOLARAM GERA	\N	C-3	3/NA	2025-03-07	f
1175	R23/8148	SURENDRA PAL NAGDAKAR	\N	\N	3	\N	417	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.252234	2026-07-03 21:19:27.252234	t	2012-03-17	f	\N	R23/8148	NANHOO LAL	\N	C-3	3/NA	2012-03-17	f
1176	R23/9089	MILHLESH RATHORE	\N	\N	3	\N	42	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.254752	2026-07-03 21:19:27.254752	t	2008-09-09	f	\N	R23/9089	RANDHIR SINGH	\N	C-3	3/NA	2008-09-09	f
1177	R23/9090	SUNEETA KATIYAR	\N	\N	3	\N	43	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.257398	2026-07-03 21:19:27.257398	t	2010-01-25	f	\N	R23/9090	G D KATIYAR	\N	C-3	3/N.A.	2010-01-25	f
1178	R23/9111	VISHAL ARORA	\N	\N	3	\N	44	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.259841	2026-07-03 21:19:27.259841	t	2009-10-26	f	\N	R23/9111	SITA RAM AROARA	\N	C-3	3/NA	2009-10-26	f
1179	R23/9112	ANITA VAISH A	\N	\N	3	\N	45	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.262585	2026-07-03 21:19:27.262585	t	2009-09-30	f	\N	R23/9112	VINET VAISH	\N	C-3	3/NA	2009-09-30	f
1180	R23/9113	SANGEETA MEHROTRA	\N	\N	3	\N	46	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.26499	2026-07-03 21:19:27.26499	t	2011-05-30	f	\N	R23/9113	R K MEHROTRA	\N	C-3	3/NA	2011-05-30	f
1181	R23/9114	SIDDHARTH BADOLA	\N	\N	3	\N	47	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.268627	2026-07-03 21:19:27.268627	t	2009-10-14	f	\N	R23/9114	B R BADOLA	\N	C-3	3/NA	2009-10-14	f
1182	R23/9116	SHAILENDRA SHARMA	\N	\N	3	\N	48	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.271465	2026-07-03 21:19:27.271465	t	2014-03-26	f	\N	R23/9116	JAGIDSH SHARMA	\N	C-3	3/NA	2014-03-26	f
1183	R23/9117	ARUN KUMAR	\N	\N	3	\N	49	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.274491	2026-07-03 21:19:27.274491	t	2009-10-27	f	\N	R23/9117	SURYA PAL AGNIHOTRI	\N	C-3	3/NA	2009-10-27	f
1184	R23/9060	ANJALI SINGH A	XXXX-XX-5549	\N	3	\N	5	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.277584	2026-07-03 21:19:27.277584	t	2021-12-18	f	\N	R23/9060	P K SINGH	\N	C-3	3/NA	2021-12-18	f
1185	R23/9118	SATISH NARAIN KHANNA	\N	\N	3	\N	50	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.28287	2026-07-03 21:19:27.28287	t	2011-12-16	f	\N	R23/9118	NIRANKOR NARIAN KAHNNA	\N	C-3	3/NA	2011-12-16	f
1186	R23/7527	GARIMA GUPTA	\N	\N	3	\N	51	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.285692	2026-07-03 21:19:27.285692	t	2009-11-16	f	\N	R23/7527	DILEEP KUMAR GUPTA	\N	C-3	3/NA	2009-11-16	f
1187	R23/7525	PARAS SANTOSHI	\N	\N	3	\N	52	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.289087	2026-07-03 21:19:27.289087	t	2010-11-25	f	\N	R23/7525	MANESH GANDRA SANTOSHI	\N	C-3	3/NA	2010-11-25	f
1188	R23/7528	REKHA AGARWAL	\N	\N	3	\N	53	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.291976	2026-07-03 21:19:27.291976	t	2011-07-02	f	\N	R23/7528	\N	\N	C-3	3/NA	2011-07-02	f
1189	R23/8176	SANJAY KUMAR PRADHAN	\N	\N	3	\N	54	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.294986	2026-07-03 21:19:27.294986	t	2012-03-28	f	\N	R23/8176	OM PRAKASH SAXENA	54	C-3	3/NA	2012-03-28	f
1190	R23/6670	MANJU MITTAL	XXXX-XX-0800	\N	3	\N	55	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.297621	2026-07-03 21:19:27.297621	f	\N	f	\N	R23/6670	\N	\N	C-3	3/NA	\N	f
1191	R23/9053	DRAUPADI DEVI A	\N	\N	3	\N	56	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.30049	2026-07-03 21:19:27.30049	t	2021-12-10	f	\N	R23/9053	SHANKAR LAL GANGWAR	\N	C-3	3/NA	2021-12-10	f
1192	R23/7537	RAJESH CHANDRA SHARMA	\N	\N	3	\N	57	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.302771	2026-07-03 21:19:27.302771	t	2009-10-29	f	\N	R23/7537	CHANDRA SHAKHER SHARMA	\N	C-3	3/NA	2009-10-29	f
1193	R23/7540	ANUPAM KUMARI SAXENA	\N	\N	3	\N	59	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.305398	2026-07-03 21:19:27.305398	t	2021-09-21	f	\N	R23/7540	\N	\N	C-3	3/NA	2021-09-21	f
1194	R23/4250	ARCHNA SHARMA	XXXX-XX-6077	\N	3	\N	59A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.308073	2026-07-03 21:19:27.308073	f	\N	f	\N	R23/4250	RAM PAL SHARMA	59A	C-3	3/NA	\N	f
1196	R23/9055	LAKSHMAN SINGH S	\N	\N	3	\N	60	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.313893	2026-07-03 21:19:27.313893	t	2021-08-17	f	\N	R23/9055	SOORAJ SINGH	\N	C-3	3/NA	2021-08-17	f
1197	R23/7602	ASHUTOSH AGARWAL	\N	\N	3	\N	61	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.316844	2026-07-03 21:19:27.316844	t	2009-10-29	f	\N	R23/7602	ANAND SWAROOP AGARWAL	\N	C-3	3/NA	2009-10-29	f
1198	R23/7603	ASHOK KUMAR MEHROTRA	\N	\N	3	\N	62	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.319486	2026-07-03 21:19:27.319486	t	2009-12-11	f	\N	R23/7603	ANAND SWAROOP AGARWAL	\N	C-3	3/NA	2009-12-11	f
1199	R23/7604	SUCHI AGARWAL	\N	\N	3	\N	63	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.323	2026-07-03 21:19:27.323	t	2010-03-20	f	\N	R23/7604	\N	\N	C-3	3/NA	2010-03-20	f
1200	R23/7605	HARISH KUMAR SHARMA	\N	\N	3	\N	64	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.325664	2026-07-03 21:19:27.325664	t	2012-03-31	f	\N	R23/7605	MOLI LAL SHARMA	\N	C-3	3/NA	2012-03-31	f
1201	R23/9110	VINOD PAL GARG G	\N	\N	3	\N	65	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.328332	2026-07-03 21:19:27.328332	f	\N	f	\N	R23/9110	\N	\N	C-3	3/NA	\N	f
1202	R23/4240	PRAKASH CHANDRA SAXENA	XXXX-XX-1190	\N	3	\N	66	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.331851	2026-07-03 21:19:27.331851	f	\N	f	\N	R23/4240	RAM MOHAN SAXENA	66	C-3	3/NA	\N	f
1203	R23/4251	MADHU GERA	XXXX-XX-0000	\N	3	\N	66A	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.334761	2026-07-03 21:19:27.334761	f	\N	f	\N	R23/4251	\N	66A	C-3	3/NA	\N	f
1204	R23/4079	ANURAG AGARWAL	\N	\N	3	\N	67	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.338004	2026-07-03 21:19:27.338004	t	2024-03-27	f	\N	R23/4079	DINESH CHANDRA AGARWAL	67	C-3	3/NA	2024-03-27	f
1195	R23/9208	Vacant	\N	\N	3	\N	6	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.310697	2026-07-03 21:19:27.310697	f	\N	f	\N	R23/9208	\N	6	C-3	3/NA	\N	f
1205	R23/9232	ASHOK KUMAR	\N	\N	3	\N	68	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.340882	2026-07-03 21:19:27.340882	t	2012-07-18	f	\N	R23/9232	AUTAR SINGH	\N	C-3	3/NA	2012-07-18	f
1206	R23/7606	GHANSHYAM DASS AGARWAL	\N	\N	3	\N	69	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.343931	2026-07-03 21:19:27.343931	t	2008-05-22	f	\N	R23/7606	SRI ARJUN AGARWAL	\N	C-3	3/NA	2008-05-22	f
1207	R23/10766	USHA GUPTA	\N	\N	3	\N	7	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.346746	2026-07-03 21:19:27.346746	t	2019-10-22	f	\N	R23/10766	RAJNEESH GUPTA	\N	C-3	3/NA	2019-10-22	f
1208	R23/7607	NISHIT AGARWAL	\N	\N	3	\N	70	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.349479	2026-07-03 21:19:27.349479	t	2008-09-11	f	\N	R23/7607	ARJUN KUMAR	\N	C-3	3/NA	2008-09-11	f
1209	R23/7608	MANSA MAHESHWARI	\N	\N	3	\N	71	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.352362	2026-07-03 21:19:27.352362	t	2014-04-09	f	\N	R23/7608	K M AGARWAL	\N	C-3	3/NA	2014-04-09	f
1210	R23/9231	RAJEEV KUMAR	\N	\N	3	\N	72	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.354975	2026-07-03 21:19:27.354975	t	2008-03-31	f	\N	R23/9231	MAHESH KUMAR	\N	C-3	3/NA	2008-03-31	f
1211	R23/7609	ARVIND KUMAR	\N	\N	3	\N	73	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.358099	2026-07-03 21:19:27.358099	t	2021-07-20	f	\N	R23/7609	RAM LAL SHARMA	\N	C-3	3/NA	2021-07-20	f
1212	R23/7610	PRADEEP KUMAR SAXENA	\N	\N	3	\N	74	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.360668	2026-07-03 21:19:27.360668	t	2010-05-17	f	\N	R23/7610	SITARAM SAXENA	\N	C-3	3/NA	2010-05-17	f
1213	R23/7611	RENU DEVI PARWAL	\N	\N	3	\N	75	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.363599	2026-07-03 21:19:27.363599	t	2009-11-13	f	\N	R23/7611	SHIV PRAKSH PARWAL	\N	C-3	3/NA	2009-11-13	f
1214	R23/7612	SANJEEV GUPTA	\N	\N	3	\N	76	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.366385	2026-07-03 21:19:27.366385	t	2009-03-31	f	\N	R23/7612	RAM MURTI GUPTA	\N	C-3	3/NA	2009-03-31	f
1215	R23/7613	PRADEEP KUMAR SAXENA	\N	\N	3	\N	77	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.369362	2026-07-03 21:19:27.369362	t	2018-05-05	f	\N	R23/7613	HANUMAN S SAXENA	\N	C-3	3/NA	2018-05-05	f
1216	R23/7614	RAHMAT KHAN	\N	\N	3	\N	78	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.372128	2026-07-03 21:19:27.372128	t	2008-11-27	f	\N	R23/7614	ALI HUSAIN KHAN	\N	C-3	3/NA	2008-11-27	f
1217	R23/7619	RAKESH KUMAR SHANKDHAR	XXXX-XX-1476	\N	3	\N	79	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.375472	2026-07-03 21:19:27.375472	t	2018-10-11	f	\N	R23/7619	HARI SWAROOP SHANKDHAR	\N	C-3	3/NA	2018-10-11	f
1218	R23/9061	ANIL KUMAR	\N	\N	3	\N	8	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.378983	2026-07-03 21:19:27.378983	t	2021-08-12	f	\N	R23/9061	BHUPRAM SINGH	\N	C-3	3/NA	2021-08-12	f
1219	R23/7621	MOHAMMAD RIAZ	\N	\N	3	\N	80	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.381828	2026-07-03 21:19:27.381828	t	2008-12-27	f	\N	R23/7621	MOHAMMAD ILYAS KHAN	\N	C-3	3/NA	2008-12-27	f
1220	R23/7622	RAJEEV JINDAL	\N	\N	3	\N	81	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.38472	2026-07-03 21:19:27.38472	t	2010-03-31	f	\N	R23/7622	BISHAN KUMAR JINDAL	\N	C-3	3/NA	2010-03-31	f
1221	R23/7625	AMIT KUMAR SAXENA	\N	\N	3	\N	82	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.387919	2026-07-03 21:19:27.387919	t	2012-05-29	f	\N	R23/7625	SHIV SHANKAR DAYAL	\N	C-3	3/NA	2012-05-29	f
1222	R23/7626	SUALAL SHARMA	\N	\N	3	\N	83	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.390977	2026-07-03 21:19:27.390977	t	2008-12-28	f	\N	R23/7626	DEEN DAYAL SHARMA	\N	C-3	3/NA	2008-12-28	f
1223	R23/7629	ARUN KUMAR AGARWAL	\N	\N	3	\N	84	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.393731	2026-07-03 21:19:27.393731	t	2008-03-31	f	\N	R23/7629	ASHOK KUMAR AGARWAL	\N	C-3	3/NA	2008-03-31	f
1224	R23/7630	SHIVAM MISHRA	\N	\N	3	\N	85	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.396369	2026-07-03 21:19:27.396369	t	2015-07-13	f	\N	R23/7630	LAXMI NARIYAN MISHRA	\N	C-3	3/NA	2015-07-13	f
1225	R23/7632	VIJAY ARORA	\N	\N	3	\N	86	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.398888	2026-07-03 21:19:27.398888	t	2012-01-23	f	\N	R23/7632	RAMESH CHANDER	\N	C-3	3/NA	2012-01-23	f
1226	R23/7633	RAJENDRA KUMAR JOHARI	\N	\N	3	\N	87	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.401491	2026-07-03 21:19:27.401491	t	2009-12-29	f	\N	R23/7633	KRISHNA CHANDRA JOHARI	\N	C-3	3/NA	2009-12-29	f
1227	R23/8184	MANISH PARWAL	\N	\N	3	\N	88	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.404323	2026-07-03 21:19:27.404323	t	2009-10-31	f	\N	R23/8184	SHYAM PARWAL	88	C-3	3/NA	2009-10-31	f
1228	R23/7635	SATISH CHANDRA JAIN	\N	\N	3	\N	89	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.407561	2026-07-03 21:19:27.407561	t	2011-05-09	f	\N	R23/7635	JAGDISH PRASAD JAIN	\N	C-3	3/NA	2011-05-09	f
1229	R23/9226	DURGESH KUMAR VERMA	XXXX-XX-7630	\N	3	\N	9	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.410426	2026-07-03 21:19:27.410426	t	2024-05-10	f	\N	R23/9226	DINESH PRASAD	\N	C-3	3/NA	2024-05-10	f
1230	R23/7636	SWAMI SARAN GANGWAR	\N	\N	3	\N	90	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.413195	2026-07-03 21:19:27.413195	t	2009-03-23	f	\N	R23/7636	BUDDH SEN	\N	C-3	3/NA	2009-03-23	f
1231	R23/7688	RAM NIWAS SAXENA	\N	\N	3	\N	91	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.41625	2026-07-03 21:19:27.41625	t	2011-05-10	f	\N	R23/7688	C.L. SAXENA	\N	C-3	3/NA	2011-05-10	f
1232	R23/9138	RAJESH KUMAR SHARMA	\N	\N	3	\N	92	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.419705	2026-07-03 21:19:27.419705	t	2011-07-28	f	\N	R23/9138	RAM CHANDRA SHARMA	\N	C-3	3/NA	2011-07-28	f
1233	R23/7694	SAROJ NIGAM	\N	\N	3	\N	93	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.422603	2026-07-03 21:19:27.422603	t	2019-05-30	f	\N	R23/7694	\N	\N	C-3	3/NA	2019-05-30	f
1234	R23/7695	DHIRAJ KUMAR	\N	\N	3	\N	94	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.425403	2026-07-03 21:19:27.425403	t	2007-03-31	f	\N	R23/7695	RAM ASREY LAL	\N	C-3	3/NA	2007-03-31	f
1235	R23/9235	GOPESH KRISHNA	\N	\N	3	\N	95	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.428349	2026-07-03 21:19:27.428349	f	\N	f	\N	R23/9235	GOPESH KRISHAN	\N	C-3	3/NA	\N	f
1236	R23/7699	SANJEEV KUMAR SAHU	\N	\N	3	\N	96	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.431176	2026-07-03 21:19:27.431176	t	2018-09-12	f	\N	R23/7699	\N	\N	C-3	3/NA	2018-09-12	f
1237	R23/7702	PRADEEP KUMAR GANGWAR	\N	\N	3	\N	97	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.434147	2026-07-03 21:19:27.434147	t	2018-08-16	f	\N	R23/7702	PRASAD GANGWAR	\N	C-3	3/NA	2018-08-16	f
1238	R23/7705	HARI KISHAN AGARWAL	\N	\N	3	\N	98	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.436989	2026-07-03 21:19:27.436989	t	2019-02-23	f	\N	R23/7705	RAM BABOO LAL	\N	C-3	3/NA	2019-02-23	f
1239	R23/7707	OM DEVI SAXENA	\N	\N	3	\N	99	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.440031	2026-07-03 21:19:27.440031	t	2008-10-23	f	\N	R23/7707	ULPAT RAM GI	\N	C-3	3/NA	2008-10-23	f
1240	R23/9206	LALIT PRIDARSHINI	XXXX-XX-9716	\N	3	\N	CP-9	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:27.442764	2026-07-03 21:19:27.442764	t	2023-01-10	f	\N	R23/9206	JAY PRAKASH SAGAR	\N	C-3	3/NA	2023-01-10	f
1241	R23/7490	SARDAR SANDEEP SINGH	\N	\N	3	\N	1	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.445644	2026-07-03 21:19:27.445644	t	2009-02-11	f	\N	R23/7490	SARDAR BHAGAWANT SINGH	\N	D-1	3/NA	2009-02-11	f
1242	R23/7513	ALOK KUMAR GUPTA	XXXX-XX-1000	\N	3	\N	10	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.44839	2026-07-03 21:19:27.44839	t	2019-05-30	f	\N	R23/7513	\N	\N	D-1	3/NA	2019-05-30	f
1243	R23/7479	KALPNA CHANDR DIXIT	\N	\N	3	\N	11	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.451055	2026-07-03 21:19:27.451055	t	2008-12-30	f	\N	R23/7479	\N	\N	D-1	3/NA	2008-12-30	f
1244	R23/7486	TEJ SINGH	\N	\N	3	\N	13	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.45366	2026-07-03 21:19:27.45366	t	2012-03-16	f	\N	R23/7486	SUMER SINGH	\N	D-1	3/NA	2012-03-16	f
1245	R23/9286	SANJEEV KUMAR	\N	\N	3	\N	15	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.456452	2026-07-03 21:19:27.456452	f	\N	f	\N	R23/9286	SANJEEV KUMAR	\N	D-1	3/NA	\N	f
1246	R23/7514	RITU SHARMA	\N	\N	3	\N	16	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.459127	2026-07-03 21:19:27.459127	t	2014-03-26	f	\N	R23/7514	\N	\N	D-1	3/NA	2014-03-26	f
1247	R23/7505	RAM	\N	\N	3	\N	17	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.461834	2026-07-03 21:19:27.461834	t	2023-03-18	f	\N	R23/7505	BUDDI RAM	\N	D-1	3/NA	2023-03-18	f
1248	R23/7508	SHALINI GOYAL	\N	\N	3	\N	18	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.465016	2026-07-03 21:19:27.465016	t	2008-12-31	f	\N	R23/7508	DEEPAK GOYAL	\N	D-1	3/NA	2008-12-31	f
1272	R23/9264	VANDNA SHARA	XXXX-XX-3654	\N	3	\N	20	\N	commercial	1125.00	\N	\N	t	2026-07-03 21:19:27.533695	2026-07-03 21:19:27.533695	t	2021-12-03	f	\N	R23/9264	NITIN KUMAR PRABHAKAR	\N	SHOP	3/NA	2021-12-03	f
1273	R23/5125	POOJA CHAUDHARY	\N	\N	3	\N	08	\N	commercial	240.00	\N	\N	t	2026-07-03 21:19:27.536615	2026-07-03 21:19:27.536615	f	\N	f	\N	R23/5125	\N	08	C.S	3/NA	\N	f
1274	R23/5837	JAGVEER SINGH	XXXX-XX-0418	\N	3	\N	10	\N	commercial	240.00	\N	\N	t	2026-07-03 21:19:27.539166	2026-07-03 21:19:27.539166	t	2024-09-18	f	\N	R23/5837	RAMPAL SINGH	\N	C.S	3/NA	2024-09-18	f
1275	R23/5834	POOJA CHADHARY	XXXX-XX-3186	\N	3	\N	8	\N	commercial	240.00	\N	\N	t	2026-07-03 21:19:27.542002	2026-07-03 21:19:27.542002	f	\N	f	\N	R23/5834	VIRENDRA SINGH	\N	C.S	3/NA	\N	f
1276	R23/5930	MAHESH CHANDRA	XXXX-XX-2697	\N	3	\N	1	\N	commercial	227.50	\N	\N	t	2026-07-03 21:19:27.544638	2026-07-03 21:19:27.544638	t	2025-03-29	f	\N	R23/5930	RAM BHAROSE LAL	\N	SHOP	3/N.A.	2025-03-29	f
1	A101RGN	Amit Saini	9839007934	amit@gmail.com	Sector-02	Ramganga Nagar	A101	01	residential	1250.00	2024-03-02	ABC, RGN, Bareilly UP	t	2026-07-03 20:05:21.908344	2026-07-03 21:53:38.844	t	2025-01-16	t	2026-04-01	A101RGN	Sambhu Nath	N/A	MIG	Block-03	2024-04-01	f
1249	R23/7511	ASHA SAXENA	\N	\N	3	\N	19	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.468082	2026-07-03 21:19:27.468082	t	2011-12-05	f	\N	R23/7511	\N	\N	D-1	3/NA	2011-12-05	f
1250	R23/7489	MALKA	\N	\N	3	\N	2	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.470649	2026-07-03 21:19:27.470649	t	2010-05-31	f	\N	R23/7489	\N	\N	D-1	3/NA	2010-05-31	f
1251	R23/7512	ADARSH KUMAR GUPTA	XXXX-XX-9000	\N	3	\N	20	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.473407	2026-07-03 21:19:27.473407	t	2019-05-30	f	\N	R23/7512	KISHAN LAL GUPTA	\N	D-1	3/NA	2019-05-30	f
1252	R23/7481	PUSHPA AGARWAL	\N	\N	3	\N	21	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.476177	2026-07-03 21:19:27.476177	t	2008-09-29	f	\N	R23/7481	\N	\N	D-1	3/NA	2008-09-29	f
1253	R23/7480	ANJALI RANI	XXXX-XX-2221	\N	3	\N	22	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.479199	2026-07-03 21:19:27.479199	t	2017-07-24	f	\N	R23/7480	\N	\N	D-1	3/NA	2017-07-24	f
1254	R23/7518	REKHA AGARWAL	\N	\N	3	\N	23	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.481813	2026-07-03 21:19:27.481813	t	2010-03-26	f	\N	R23/7518	\N	\N	D-1	3/NA	2010-03-26	f
1255	R23/7487	SUNITA SHANI	\N	\N	3	\N	24	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.485243	2026-07-03 21:19:27.485243	t	2011-05-10	f	\N	R23/7487	RAJEEV SHANI	\N	D-1	3/NA	2011-05-10	f
5	R23/11367	KAMAL GOEL	XXXX-XX-8655	\N	3	\N	1	\N	residential	5000.00	\N	\N	t	2026-07-03 21:19:23.820759	2026-07-03 21:19:23.820759	f	\N	f	\N	R23/11367	SITA RAM	\N	A-1	3/NA	\N	f
6	R23/2636	RISHABH SINGH	XXXX-XX-9868	\N	3	\N	2	\N	residential	5000.00	\N	\N	t	2026-07-03 21:19:23.824066	2026-07-03 21:19:23.824066	f	\N	f	\N	R23/2636	\N	2	A-1	3/NA	\N	f
7	R23/2877	BRAJENDRA SINGH	XXXX-XX-2763	\N	3	\N	94	\N	residential	1620.00	\N	\N	t	2026-07-03 21:19:23.827984	2026-07-03 21:19:23.827984	t	2024-03-16	f	\N	R23/2877	\N	94	B	3/NA	2024-03-16	f
8	R23/8300	B L VARSHNEY	XXXX-XX-0123	\N	3	\N	19	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.831824	2026-07-03 21:19:23.831824	t	2022-08-24	f	\N	R23/8300	DEOKI NANDAN VARSHNEY	\N	B-1	3/NA	2022-08-24	f
9	R23/8286	YOGESH CHANDRA MISHRA	XXXX-XX-0995	\N	3	\N	01	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.838504	2026-07-03 21:19:23.838504	t	2021-03-31	f	\N	R23/8286	KRISHNA KUMAR MISHRA	\N	B-1	3/NA	2021-03-31	f
10	R23/8287	RAVINDRA SINGH	\N	\N	3	\N	03	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.841868	2026-07-03 21:19:23.841868	t	2022-05-21	f	\N	R23/8287	SATAVIR SINGH	\N	B-1	3/NA	2022-05-21	f
11	R23/8288	SHARAD	XXXX-XX-0400	\N	3	\N	06	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.845274	2026-07-03 21:19:23.845274	t	2020-10-08	f	\N	R23/8288	P K SHARMA	\N	B-1	3/NA	2020-10-08	f
12	R23/8289	NEHA AGARWAL, NIDHI AGARWAL	XXXX-XX-8164	\N	3	\N	07	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.848182	2026-07-03 21:19:23.848182	t	2022-07-29	f	\N	R23/8289	BRIJENDRA JOHARI	\N	B-1	3/NA	2022-07-29	f
13	R23/8290	SANJAY KUMAR AGARWAL	XXXX-XX-1321	\N	3	\N	09	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.851715	2026-07-03 21:19:23.851715	t	2020-02-20	f	\N	R23/8290	R K AGARWAL	\N	B-1	3/NA	2020-02-20	f
14	R23/8291	MOHD FAROOQUE	XXXX-XX-9236	\N	3	\N	10	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:23.855035	2026-07-03 21:19:23.855035	t	2022-06-25	f	\N	R23/8291	ABDUL AZIZ	\N	B-1	3/NA	2022-06-25	f
1256	R23/7509	SANDEEP KISHORE AGARWAL	\N	\N	3	\N	25	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.487481	2026-07-03 21:19:27.487481	t	2010-07-31	f	\N	R23/7509	V K AGARWAL	\N	D-1	3/NA	2010-07-31	f
1257	R23/7507	SHIV SHANKAR PAL	\N	\N	3	\N	26	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.490092	2026-07-03 21:19:27.490092	t	2010-03-31	f	\N	R23/7507	RAM JI DASS PAL	\N	D-1	3/NA	2010-03-31	f
1258	R23/7502	RAM PAL SINGH	\N	\N	3	\N	27	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.492875	2026-07-03 21:19:27.492875	t	2007-09-14	f	\N	R23/7502	TOTI SINGH	\N	D-1	3/NA	2007-09-14	f
97	R23/8931	NISHA JAIN	\N	\N	3	\N	78	\N	residential	2880.00	\N	\N	t	2026-07-03 21:19:24.122713	2026-07-03 21:19:24.122713	f	\N	f	\N	R23/8931	AVIN JAIN	\N	B-1	3/NA	\N	f
1126	R23/10774	Vacant	\N	\N	3	\N	375	\N	residential	720.00	\N	\N	t	2026-07-03 21:19:27.106438	2026-07-03 21:19:27.106438	f	\N	f	\N	R23/10774	\N	375	C-3	3/NA	\N	f
1259	R23/7483	ANWAR HUSAIN	\N	\N	3	\N	28	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.49619	2026-07-03 21:19:27.49619	t	2021-12-07	f	\N	R23/7483	SHIR INTZAR HUSSAIN	\N	D-1	3/NA	2021-12-07	f
1260	R23/7478	RAJ KUMARI DEVI	XXXX-XX-7569	\N	3	\N	3	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.498584	2026-07-03 21:19:27.498584	t	2009-12-07	f	\N	R23/7478	\N	\N	D-1	3/NA	2009-12-07	f
1261	R23/7510	ABHAI KUMAR SAXENA	\N	\N	3	\N	30	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.501316	2026-07-03 21:19:27.501316	t	2014-08-12	f	\N	R23/7510	CHANDRA PRAKASH	\N	D-1	3/NA	2014-08-12	f
1262	R23/7504	MEENA AGARWAL	\N	\N	3	\N	4	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.503972	2026-07-03 21:19:27.503972	t	2013-11-01	f	\N	R23/7504	\N	\N	D-1	3/NA	2013-11-01	f
1263	R23/7517	ANAND KUMAR SAXENA	\N	\N	3	\N	5	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.507125	2026-07-03 21:19:27.507125	t	2019-07-02	f	\N	R23/7517	LAXMI NARAYAN SAXENA	\N	D-1	3/NA	2019-07-02	f
1264	R23/7484	LAXMI PRASAD	\N	\N	3	\N	6	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.511234	2026-07-03 21:19:27.511234	t	2022-02-01	f	\N	R23/7484	\N	\N	D-1	3/NA	2022-02-01	f
1265	R23/7482	ANITA	\N	\N	3	\N	7	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.514209	2026-07-03 21:19:27.514209	t	2010-07-16	f	\N	R23/7482	\N	\N	D-1	3/NA	2010-07-16	f
1266	R23/7520	SANJAY SAXENA	\N	\N	3	\N	8	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.516896	2026-07-03 21:19:27.516896	t	2008-12-27	f	\N	R23/7520	R B SAXENA	\N	D-1	3/NA	2008-12-27	f
1267	R23/7506	AKHILESH KMAR SHUKLA	\N	\N	3	\N	9	\N	residential	600.00	\N	\N	t	2026-07-03 21:19:27.519907	2026-07-03 21:19:27.519907	t	2008-12-30	f	\N	R23/7506	RAMAKANT SHUKLA	\N	D-1	3/NA	2008-12-30	f
1268	R23/3196	SARITA	XXXX-XX-6938	\N	3	\N	124	\N	residential	360.00	\N	\N	t	2026-07-03 21:19:27.522471	2026-07-03 21:19:27.522471	f	\N	f	\N	R23/3196	\N	124	E-1	3/NA	\N	f
1269	R23/9282	MUNIBINDAR	XXXX-XX-1398	\N	3	\N	5	\N	residential	1500.00	\N	\N	t	2026-07-03 21:19:27.525466	2026-07-03 21:19:27.525466	t	2024-08-23	f	\N	R23/9282	BISAN CHANDRA AGARWAL	\N	PLOT	3/NA	2024-08-23	f
1270	R23/2368	NEHA SATI	XXXX-XX-6423	\N	3	\N	63	\N	residential	1125.00	\N	\N	t	2026-07-03 21:19:27.528294	2026-07-03 21:19:27.528294	t	2023-12-15	f	\N	R23/2368	\N	63	PLOT	3/NA	2023-12-15	f
1271	R23/8337	LUCKNOW PUBLIC CHARITABLE TRUST	XXXX-XX-8898	\N	3	\N	SCHOOL PLOT	\N	residential	82720.00	\N	\N	t	2026-07-03 21:19:27.531069	2026-07-03 21:19:27.531069	t	2025-03-07	f	\N	R23/8337	\N	\N	SCHOOL	3/NA	2025-03-07	f
1277	G3/3972	Chandan Kumar	9140414848	chandan0903@gmail.com	3	\N	P1/234	\N	residential	1230.00	2021-07-31	\N	t	2026-07-03 21:19:27.548299	2026-07-03 21:56:26.526	t	2022-01-01	t	2025-01-01	G3/3972	Raj Kishor	P1/234	A-2	3/NA	2021-09-01	f
\.


--
-- Data for Name: maintenance_rate_slabs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_rate_slabs (id, property_type, description, rate_per_sqft, minimum_charge, effective_from, is_active, created_at, updated_at, is_developed, effective_to) FROM stdin;
3	residential	Residetial Rate from 2020	0.20	100.00	2020-04-01	t	2026-07-03 20:16:29.340058	2026-07-03 20:16:29.340058	f	2026-03-31
4	residential	Residential Developed Rate 2020	0.30	300.00	2020-04-01	t	2026-07-03 20:56:12.250731	2026-07-03 20:56:12.250731	t	2026-03-31
1	residential	Residential Rate 2026-27	0.25	100.00	2026-04-01	t	2026-07-03 20:02:47.203477	2026-07-03 20:54:59.022	f	2027-03-31
2	residential	Rate for Developed Area 2026-27	0.45	200.00	2026-04-01	t	2026-07-03 20:14:55.180321	2026-07-03 20:54:39.66	t	2027-03-31
\.


--
-- Data for Name: maintenance_receipts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_receipts (id, charge_id, receipt_no, paid_amount, paid_date, payment_mode, transaction_ref, collected_by, remarks, created_at) FROM stdin;
1	1	MC-MR5F6N27	378.56	2026-01-01	upi	UTR:0876883PAID	Ram Singh JE	Test	2026-07-03 21:02:48.36195
2	1	MC-MR5FHFT3	378.56	2026-07-03	cash	PJOV09655769kJGHF	Cashier	Test	2026-07-03 21:11:12.097391
\.


--
-- Data for Name: marquee_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.marquee_items (id, title, file_url, file_type, is_active, display_order, created_at, updated_at) FROM stdin;
1	One Time Settlement (OTS) 2026 - Apply Here	https://upots.in/	link	t	1	2026-06-27 20:25:03.512476+00	2026-06-27 20:25:03.512476+00
2	पीलीभीत बाईपास मार्ग से सटी हुई नई टाउनशिप हेतु बरेली विकास प्राधिकरण को भूमि विक्रय का प्रारूप।	https://bdainfo.org/Website/assets/pdf/ConsentLetterPBY.pdf	pdf	t	2	2026-06-27 20:25:57.832664+00	2026-06-27 20:25:57.832664+00
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, is_tender, last_date, is_active, display_order, created_at, updated_at) FROM stdin;
1	Registration open for The Sky-Way Apartment (1 Jun 2025 to 31 Mar 2027)	f	\N	t	1	2026-06-27 06:25:44.039707+00	2026-06-27 06:25:44.039707+00
2	How to Apply Instructions for Property ITS 2026	f	\N	t	2	2026-06-27 06:25:44.091807+00	2026-06-27 06:25:44.091807+00
3	One Time Settlement (OTS) 2026 for outstanding dues — Apply before 31 March 2026	f	\N	t	3	2026-06-27 06:25:44.159442+00	2026-06-27 06:25:44.159442+00
4	Model Building Construction and Development Byelaws and Model Zoning Regulation, 2025	f	\N	t	4	2026-06-27 06:25:44.207545+00	2026-06-27 06:25:44.207545+00
5	Supply of Office Furniture and Equipment	t	2025-06-30	t	1	2026-06-27 06:25:44.253506+00	2026-06-27 06:25:44.253506+00
6	Construction of Roads in Ramganga Nagar — Phase II	t	2025-07-15	t	2	2026-06-27 06:25:44.292108+00	2026-06-27 06:25:44.292108+00
7	Landscaping Works at Ramayan Vatika	t	2025-07-20	t	3	2026-06-27 06:25:44.344741+00	2026-06-27 06:25:44.344741+00
\.


--
-- Data for Name: officials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.officials (id, name, designation, department, photo_url, display_order, is_active, created_at, updated_at) FROM stdin;
1	Shri P. Guruprashad, IAS	Principal Secretary	Housing and Urban Planning, Uttar Pradesh	https://bdainfo.org/website/theme/images/PS.jpg	1	t	2026-06-27 06:25:43.862661+00	2026-06-29 16:16:11.268+00
2	Shri Bhupendra S. Chaudhary, I.A.S.	Commissioner Bareilly	Bareilly Division	https://bdainfo.org/website/theme/images/CommSir.jpg	2	t	2026-06-27 06:25:43.956738+00	2026-06-29 16:16:54.979+00
3	Ms Saumya Pandey, IAS	Vice Chairman	Bareilly Development Authority	https://bdainfo.org/website/theme/images/VCmamPhoto.jpg	3	t	2026-06-27 06:25:43.986114+00	2026-06-29 16:17:17.467+00
\.


--
-- Data for Name: payroll_banks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_banks (id, name, status, created_at, updated_at) FROM stdin;
1	Allahbad Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
2	Axis Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
3	Bank of Baroda	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
4	CANARA BANK	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
5	HDFC Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
6	ICICI Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
7	INDIAN BANK	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
8	Punjab National Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
9	State Bank of India	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
10	Syndicate Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
11	UCO Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
12	Vijaya Bank	active	2026-07-12 11:30:20.268799+00	2026-07-12 11:30:20.268799+00
\.


--
-- Data for Name: payroll_branches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_branches (id, name, status, created_at, updated_at) FROM stdin;
1	Account	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
2	Administration	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
3	Building Control	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
4	Computer Section	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
5	Engineering	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
6	Establishment	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
7	Horticulture	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
8	Land Acquistion	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
9	Legal	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
10	Map Section	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
11	Nazarat	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
12	Officers IAS/PCS	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
13	Planning	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
14	Property	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
15	Public Relation	active	2026-07-12 11:30:18.419685+00	2026-07-12 11:30:18.419685+00
\.


--
-- Data for Name: payroll_designations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_designations (id, name, status, created_at, updated_at) FROM stdin;
1	Account Clerk	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
2	Accountant	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
3	Asst. Accountant	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
4	Asst. Programmer	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
5	Asst. Account Officer	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
6	C.E.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
7	C.T.P.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
8	Chowkidar	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
9	Clerk	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
10	Con. Operator	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
11	Draftman	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
12	Driver	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
13	Electrician	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
14	Ex. Engg.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
15	FC	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
16	Gen. Operator	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
17	Head Clerk	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
18	H.I.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
19	J.E.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
20	Lekhpal	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
21	Mali	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
22	OSD	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
23	Peon	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
24	Plumber	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
25	R.I.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
26	Secretary	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
27	Servey Admin	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
28	Steno	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
29	Surveyor	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
30	Sweeper	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
31	Tehsildar	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
32	TubeWell Oper.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
33	Typist	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
34	VC	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
35	A.E.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
36	Mate	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
37	Beldar	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
38	Carpainter	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
39	Helper	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
40	Store Keeper	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
41	Store Clerk	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
42	Tractor Driver	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
43	Tractor Helper	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
44	Telephone Operator	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
45	H.S.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
46	GANGMAN	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
47	MATE / TUBE WELL OPR	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
48	Store Munshi	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
49	S.D.M	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
50	F.A.O	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
51	Joint Secretary	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
52	Office Superintendent	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
53	A.A.O	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
54	S.E.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
55	T.P	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
56	A.T.P	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
57	A.O.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
58	AHO	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
59	Addl Secretary	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
60	P.A.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
61	Deputy Collector	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
62	W/MAN	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
63	BLUE PRI	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
64	JR CLERK	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
65	C.F.A.O.	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
66	SUPERVISOR	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
67	C.PROGRAMMER	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
68	D/MAN	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
69	K.BUNKAR	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
70	FERO BOY	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
71	DAFTARI	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
72	U.S	active	2026-07-12 11:30:16.084995+00	2026-07-12 11:30:16.084995+00
\.


--
-- Data for Name: payroll_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_groups (id, name, status, created_at, updated_at) FROM stdin;
1	A	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
2	A+	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
3	B	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
4	C	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
5	D	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
6	DW - B	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
7	DW - C	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
8	DW - D	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
9	E	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
10	F	active	2026-07-12 11:47:32.326652+00	2026-07-12 11:47:32.326652+00
\.


--
-- Data for Name: payroll_house_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_house_types (id, name, status, created_at, updated_at) FROM stdin;
1	Pvt.	active	2026-07-12 11:30:35.046664+00	2026-07-12 11:30:35.046664+00
2	Govt.	active	2026-07-12 11:30:44.682195+00	2026-07-12 11:30:44.682195+00
\.


--
-- Data for Name: payroll_paybill_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_paybill_groups (id, name, status, created_at, updated_at) FROM stdin;
1	Officer	active	2026-07-12 11:30:56.268608+00	2026-07-12 11:30:56.268608+00
2	Employees	active	2026-07-12 11:31:05.382508+00	2026-07-12 11:31:05.382508+00
3	Contract	active	2026-07-12 11:46:46.468888+00	2026-07-12 11:46:46.468888+00
\.


--
-- Data for Name: payroll_qualifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_qualifications (id, name, status, created_at, updated_at) FROM stdin;
1	5th	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
2	8th	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
3	Matric Pass	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
4	B.A.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
5	B.Arch	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
6	B.E. (CIVIL)	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
7	B.ED.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
8	B.Sc Planning	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
9	B.SC.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
10	B.SC. Ag.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
11	B.SC. Engg Civil	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
12	B.TECH. IN CIVIL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
13	B.TECH. IN ELECTRICAL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
14	B.TECH. IN MACHNICAL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
15	DIPLOMA	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
16	DIPLOMA IN CIVIL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
17	DIPLOMA IN ELECTRICAL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
18	DIPLOMA IN MACHENICAL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
19	GRADUATION	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
20	HIGH SCHOOL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
21	IIT	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
22	INTERMEDIATE	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
23	JUNIOR HIGH SCHOOL	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
24	LLB	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
25	LLM	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
26	M.A.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
27	M.Arch	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
28	M.Sc Planing	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
29	M.SC.	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
30	MATRICULATION	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
31	MBA	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
32	NA	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
33	POST GRADUATE DIPLOMA IN COMPUTER	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
34	POST GRADUATION	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
35	PRIMARY EDUCATION	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
36	SAKSHAR	active	2026-07-12 11:09:39.784172+00	2026-07-12 11:09:39.784172+00
\.


--
-- Data for Name: payroll_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_records (id, employee_id, emp_code, emp_name, month, year, basic_pay, da, gross_pay, total_deductions, net_pay, status, paid_date, remarks, is_active, created_at, updated_at, employer_nps, worked_days, month_days, total_allowances, allowances_data, deductions_data) FROM stdin;
7	105	105	AJEET KUMAR SINGH	2	2026	71100.00	42660.00	113760.00	0.00	113760.00	draft	\N	\N	f	2026-07-11 17:47:57.324669	2026-07-11 17:56:42.490416	15926.00	\N	30	0.00	[]	[]
8	2	2	VANDITA SRIVASTAVA	2	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	f	2026-07-11 17:47:57.359968	2026-07-11 17:56:42.490416	18122.00	\N	30	0.00	[]	[]
9	1	2000878	MANIKANDAN A.	2	2026	83300.00	49980.00	133280.00	0.00	133280.00	draft	\N	\N	f	2026-07-11 17:47:57.366584	2026-07-11 17:56:42.490416	18659.00	\N	30	0.00	[]	[]
10	4	4	Sri DEEPAK KUMAR	2	2026	96600.00	57960.00	154560.00	0.00	154560.00	draft	\N	\N	f	2026-07-11 17:47:57.380061	2026-07-11 17:56:42.490416	21638.00	\N	30	0.00	[]	[]
11	3	754399	SHIV DHANI SINGH YADAV	2	2026	122900.00	73740.00	196640.00	0.00	196640.00	draft	\N	\N	f	2026-07-11 17:47:57.384212	2026-07-11 17:56:42.490416	27530.00	\N	30	0.00	[]	[]
12	107	EMP-107	SMT NEELAM SRIVASTAVA	2	2026	0.00	0.00	0.00	0.00	0.00	draft	\N	\N	f	2026-07-11 17:47:57.389304	2026-07-11 17:56:42.490416	0.00	\N	30	0.00	[]	[]
1	105	105	AJEET KUMAR SINGH	1	2026	71100.00	42660.00	113760.00	0.00	113760.00	draft	\N	\N	f	2026-07-11 17:37:50.224489	2026-07-11 17:56:42.490416	15926.00	\N	30	0.00	[]	[]
2	2	2	VANDITA SRIVASTAVA	1	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	f	2026-07-11 17:37:50.259207	2026-07-11 17:56:42.490416	18122.00	\N	30	0.00	[]	[]
3	1	2000878	MANIKANDAN A.	1	2026	83300.00	49980.00	133280.00	0.00	133280.00	draft	\N	\N	f	2026-07-11 17:37:50.27207	2026-07-11 17:56:42.490416	18659.00	\N	30	0.00	[]	[]
4	4	4	Sri DEEPAK KUMAR	1	2026	96600.00	57960.00	154560.00	0.00	154560.00	draft	\N	\N	f	2026-07-11 17:37:50.276184	2026-07-11 17:56:42.490416	21638.00	\N	30	0.00	[]	[]
5	3	754399	SHIV DHANI SINGH YADAV	1	2026	122900.00	73740.00	196640.00	0.00	196640.00	draft	\N	\N	f	2026-07-11 17:37:50.281238	2026-07-11 17:56:42.490416	27530.00	\N	30	0.00	[]	[]
6	107	EMP-107	SMT NEELAM SRIVASTAVA	1	2026	0.00	0.00	0.00	0.00	0.00	draft	\N	\N	f	2026-07-11 17:37:50.284223	2026-07-11 17:56:42.490416	0.00	\N	30	0.00	[]	[]
13	105	105	AJEET KUMAR SINGH	3	2026	71100.00	42660.00	113760.00	0.00	113760.00	draft	\N	\N	f	2026-07-11 17:55:45.487789	2026-07-11 17:56:42.490416	15926.00	\N	30	0.00	[]	[]
14	2	2	VANDITA SRIVASTAVA	3	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	f	2026-07-11 17:56:09.708257	2026-07-11 17:56:42.490416	18122.00	\N	30	0.00	[]	[]
15	1	2000878	MANIKANDAN A.	3	2026	83300.00	49980.00	133280.00	0.00	133280.00	draft	\N	\N	f	2026-07-11 17:56:09.713491	2026-07-11 17:56:42.490416	18659.00	\N	30	0.00	[]	[]
16	4	4	Sri DEEPAK KUMAR	3	2026	96600.00	57960.00	154560.00	0.00	154560.00	draft	\N	\N	f	2026-07-11 17:56:09.718623	2026-07-11 17:56:42.490416	21638.00	\N	30	0.00	[]	[]
17	3	754399	SHIV DHANI SINGH YADAV	3	2026	122900.00	73740.00	196640.00	0.00	196640.00	draft	\N	\N	f	2026-07-11 17:56:09.723914	2026-07-11 17:56:42.490416	27530.00	\N	30	0.00	[]	[]
18	107	EMP-107	SMT NEELAM SRIVASTAVA	3	2026	0.00	0.00	0.00	0.00	0.00	draft	\N	\N	f	2026-07-11 17:56:09.729141	2026-07-11 17:56:42.490416	0.00	\N	30	0.00	[]	[]
19	105	105	AJEET KUMAR SINGH	1	2026	71100.00	42660.00	113760.00	0.00	113760.00	draft	\N	\N	t	2026-07-11 18:00:43.928837	2026-07-11 18:00:43.928837	15926.00	\N	30	0.00	[]	[]
20	2	2	VANDITA SRIVASTAVA	1	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	t	2026-07-11 18:00:43.942706	2026-07-11 18:00:43.942706	18122.00	\N	30	0.00	[]	[]
21	1	2000878	MANIKANDAN A.	1	2026	83300.00	49980.00	133280.00	0.00	133280.00	draft	\N	\N	t	2026-07-11 18:01:49.709584	2026-07-11 18:01:49.709584	18659.00	\N	30	0.00	[]	[]
22	4	4	Sri DEEPAK KUMAR	1	2026	96600.00	57960.00	154560.00	0.00	154560.00	draft	\N	\N	t	2026-07-11 18:01:49.74452	2026-07-11 18:01:49.74452	21638.00	\N	30	0.00	[]	[]
23	3	754399	SHIV DHANI SINGH YADAV	1	2026	122900.00	73740.00	196640.00	0.00	196640.00	draft	\N	\N	t	2026-07-11 18:01:49.749416	2026-07-11 18:01:49.749416	27530.00	\N	30	0.00	[]	[]
24	107	EMP-107	SMT NEELAM SRIVASTAVA	1	2026	0.00	0.00	0.00	0.00	0.00	draft	\N	\N	t	2026-07-11 18:01:49.753591	2026-07-11 18:01:49.753591	0.00	\N	30	0.00	[]	[]
25	2	2	VANDITA SRIVASTAVA	2	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	t	2026-07-11 18:03:28.092336	2026-07-11 18:03:28.092336	18122.00	\N	30	0.00	[]	[]
26	2	2	VANDITA SRIVASTAVA	3	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	t	2026-07-11 18:04:45.491945	2026-07-11 18:04:45.491945	18122.00	\N	30	0.00	[]	[]
27	2	2	VANDITA SRIVASTAVA	4	2026	80900.00	48540.00	132440.00	11320.00	121120.00	draft	\N	\N	t	2026-07-12 12:31:18.086997	2026-07-12 12:31:18.086997	18122.00	\N	30	0.00	[]	[]
28	3	754399	SHIV DHANI SINGH YADAV	2	2026	122900.00	73740.00	206640.00	21800.00	184840.00	draft	\N	\N	t	2026-07-12 13:09:41.847432	2026-07-12 13:09:41.847432	27530.00	\N	30	0.00	[]	[]
29	3	754399	SHIV DHANI SINGH YADAV	7	2026	122900.00	73740.00	206640.00	21800.00	184840.00	draft	\N	\N	t	2026-07-12 13:38:45.714458	2026-07-12 13:38:45.714458	27530.00	\N	30	0.00	[]	[]
30	3	754399	SHIV DHANI SINGH YADAV	6	2026	122900.00	73740.00	206640.00	21800.00	184840.00	draft	\N	\N	t	2026-07-12 13:46:00.410938	2026-07-12 13:46:00.410938	27530.00	\N	30	0.00	[]	[]
31	3	754399	SHIV DHANI SINGH YADAV	5	2026	122900.00	73740.00	206640.00	21800.00	184840.00	draft	\N	\N	t	2026-07-12 13:57:21.612697	2026-07-12 13:57:21.612697	27530.00	\N	30	0.00	[]	[]
32	3	754399	SHIV DHANI SINGH YADAV	4	2026	81933.00	49160.00	141093.00	21800.00	119293.00	processed	\N	\N	t	2026-07-12 14:20:05.010199	2026-07-12 14:21:03.727062	18353.00	20	30	10000.00	[{"name": "Allowance", "amount": 1000}, {"name": "Washing Allowance", "amount": 2000}, {"name": "Medical Allowance", "amount": 3000}, {"name": "Handicap Allowance", "amount": 4000}]	[{"name": "Income Tax", "amount": 10000}, {"name": "Vehicle Deduction", "amount": 5000}, {"name": "House Rent Deduction", "amount": 6000}, {"name": "GVR", "amount": 800}]
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photos (id, title, image_url, is_active, display_order, created_at, updated_at) FROM stdin;
4	BDA Project Photo 4	https://placehold.co/400x300/1a3a6e/ffffff?text=BDA+Photo+4	t	4	2026-06-27 06:25:44.680963+00	2026-06-27 06:25:44.680963+00
5	BDA Project Photo 5	https://placehold.co/400x300/1a3a6e/ffffff?text=BDA+Photo+5	t	5	2026-06-27 06:25:44.738351+00	2026-06-27 06:25:44.738351+00
6	BDA Project Photo 6	https://placehold.co/400x300/1a3a6e/ffffff?text=BDA+Photo+6	t	6	2026-06-27 06:25:44.789154+00	2026-06-27 06:25:44.789154+00
7	BDA	https://bdainfo.org/Website/theme/images/crousal/ramayanVatika14.jpg	t	1	2026-06-27 20:27:43.674424+00	2026-06-27 20:27:43.674424+00
1	BDA Project Photo	https://bdainfo.org/Website/theme/images/crousal/ramayanVatika19.jpg	t	2	2026-06-27 06:25:44.538199+00	2026-06-27 20:28:27.841+00
8	BDA	https://bdainfo.org/Website/theme/images/crousal/1.jpg	t	3	2026-06-27 20:28:59.133559+00	2026-06-27 20:28:59.133559+00
2	BDA Project Photo 2	https://placehold.co/400x300/1a3a6e/ffffff?text=BDA+Photo+2	t	8	2026-06-27 06:25:44.598419+00	2026-06-27 20:29:06.369+00
3	BDA	https://bdainfo.org/Website/theme/images/crousal/3.jpg	t	9	2026-06-27 06:25:44.627717+00	2026-06-28 16:16:56.736+00
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.properties (id, property_no, applicant_name, father_name, address, phone, email, scheme, sector, plot_no, area, area_unit, type, status, allotment_date, registry_date, total_cost, remarks, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: scheme_display_cards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scheme_display_cards (id, section, title, image_url, display_order, created_at) FROM stdin;
1	ongoing	Greater Bareilly	https://bdainfo.org/website/assets/images/BDAos1.png	1	2026-06-29 16:07:18.038356+00
2	ongoing	Pilinhit Bypass	https://bdainfo.org/website/assets/images/BDAos2.png	1	2026-06-29 16:07:57.607622+00
3	ongoing	Township	https://bdainfo.org/website/assets/images/BDAos3.png	2	2026-06-29 16:09:28.079245+00
4	ongoing	MSME Township	https://bdainfo.org/website/assets/images/BDAos4.png	4	2026-06-29 16:09:51.217009+00
5	schemes	Brahmputra Enclave	https://bdainfo.org/website/assets/images/S101.jpg	1	2026-06-29 16:10:27.960421+00
\.


--
-- Data for Name: schemes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schemes (id, type, title, title_hindi, description, description_hindi, image_url, start_date, end_date, fees, fees_label, is_active, display_order, created_at, updated_at, booklet_url, is_open_for_registration) FROM stdin;
3	scheme	Sky Way Apartment	\N	\N	\N	https://bdainfo.org/img/FlatsBDA.png	2026-06-01 00:00:00+00	2026-07-31 00:00:00+00	590.00	\N	t	1	2026-06-29 07:49:04.709971+00	2026-06-29 07:49:04.709971+00	https://bdainfo.org/TheSkyWayApartment.pdf	t
4	survey	Demand Survey of Bareilly Industrial Township Logistics Zone 1	\N	\N	\N	https://bdainfo.org/img/Logistics.png	2026-01-16 00:00:00+00	2026-01-18 00:00:00+00	590.00	\N	t	2	2026-06-29 15:43:08.057505+00	2026-06-29 15:43:08.057505+00	\N	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, username, email, password_hash, role, department, designation, phone, is_active, created_at, updated_at) FROM stdin;
1	Super Admin	superadmin	\N	$2b$10$qUoJ0qVNI/DkSaNMuuLeM.5ma03DR.3vk/mYrShBwvnfY45VAEINi	superadmin	IT	System Administrator	\N	t	2026-06-28 14:12:46.599562	2026-06-28 14:12:46.599562
2	BDA Admin	admin	\N	$2b$10$1HjpZv6.eGmX3KYkkHG1C.RT3Jg.Xg9lOQCcghJ9fiblUH348vGQm	admin	Administration	Administrator	\N	t	2026-06-28 14:12:46.643892	2026-06-28 14:12:46.643892
3	Web Officer	webmaster	\N	$2b$10$SQQMN/9AUSPNDXdLSA31fujeEyDc33fHcj5En6EvvDzGwDG.BmoEm	officer	IT	Web Master	\N	t	2026-06-28 14:13:48.737842	2026-06-28 14:13:48.737842
4	Chandan Kumar	chandan0903	chandan0903@gmail.com	$2b$10$.R2HRMMDcPiLEsvmbFPWnuH1hL2XupGWMwDSJoZIgeiYyf.MEupw6	officer	Planning	Computer Operator	09839007934	t	2026-07-04 14:31:41.713908	2026-07-04 14:31:41.713908
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.videos (id, title, video_url, thumbnail_url, is_active, display_order, created_at, updated_at) FROM stdin;
2	BDA Video 2	https://www.youtube.com/watch?v=dQw4w9WgXcQ	https://placehold.co/320x180/1a3a6e/ffffff?text=BDA+Video+2	t	2	2026-06-27 06:25:44.897048+00	2026-06-27 06:25:44.897048+00
3	BDA Video 3	https://www.youtube.com/watch?v=dQw4w9WgXcQ	https://placehold.co/320x180/1a3a6e/ffffff?text=BDA+Video+3	t	3	2026-06-27 06:25:44.945703+00	2026-06-27 06:25:44.945703+00
1	Ramayan Vatika	https://www.youtube.com/watch?v=nFHyOY_pH38&t=2s	https://bdainfo.org/Website/theme/images/banner/ramayanvatika.png	t	1	2026-06-27 06:25:44.84476+00	2026-06-27 20:31:02.677+00
\.


--
-- Data for Name: whats_new; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.whats_new (id, content, is_active, display_order, created_at, updated_at) FROM stdin;
1	बरेली विकास प्राधिकरण में ई-नीलामी के माध्यम से भूखंडों एवं भवन की बिक्री हेतु आवेदन आमंत्रित किए जाते हैं।	t	1	2026-06-27 06:25:44.402273+00	2026-06-27 06:25:44.402273+00
2	रामगंगा नगर आवासीय योजना के अंतर्गत नई टाउनशिप में भूखंड आवंटन हेतु आवेदन प्रारंभ।	t	2	2026-06-27 06:25:44.456856+00	2026-06-27 06:25:44.456856+00
3	प्राधिकरण की बैठक में लिए गए महत्वपूर्ण निर्णय — नई टाउनशिप पीलीभीत बाईपास के निकट।	t	3	2026-06-27 06:25:44.483656+00	2026-06-27 06:25:44.483656+00
\.


--
-- Name: allowance_heads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.allowance_heads_id_seq', 4, true);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banners_id_seq', 3, true);


--
-- Name: budget_heads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.budget_heads_id_seq', 1, false);


--
-- Name: court_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.court_cases_id_seq', 1, false);


--
-- Name: da_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.da_master_id_seq', 6, true);


--
-- Name: deduction_heads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.deduction_heads_id_seq', 4, true);


--
-- Name: employee_allowances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employee_allowances_id_seq', 32, true);


--
-- Name: employee_deductions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employee_deductions_id_seq', 32, true);


--
-- Name: employee_leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employee_leaves_id_seq', 16, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employees_id_seq', 109, true);


--
-- Name: finance_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.finance_transactions_id_seq', 1, false);


--
-- Name: grievance_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grievance_roles_id_seq', 3, true);


--
-- Name: grievance_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grievance_sections_id_seq', 6, true);


--
-- Name: grievance_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grievance_subjects_id_seq', 9, true);


--
-- Name: grievances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grievances_id_seq', 7, true);


--
-- Name: leave_heads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leave_heads_id_seq', 2, true);


--
-- Name: lic_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lic_entries_id_seq', 107, true);


--
-- Name: maintenance_charges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_charges_id_seq', 6, true);


--
-- Name: maintenance_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_properties_id_seq', 1277, true);


--
-- Name: maintenance_rate_slabs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_rate_slabs_id_seq', 5, true);


--
-- Name: maintenance_receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_receipts_id_seq', 2, true);


--
-- Name: marquee_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marquee_items_id_seq', 2, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 7, true);


--
-- Name: officials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.officials_id_seq', 3, true);


--
-- Name: payroll_banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_banks_id_seq', 12, true);


--
-- Name: payroll_branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_branches_id_seq', 15, true);


--
-- Name: payroll_designations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_designations_id_seq', 72, true);


--
-- Name: payroll_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_groups_id_seq', 10, true);


--
-- Name: payroll_house_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_house_types_id_seq', 2, true);


--
-- Name: payroll_paybill_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_paybill_groups_id_seq', 3, true);


--
-- Name: payroll_qualifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_qualifications_id_seq', 36, true);


--
-- Name: payroll_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payroll_records_id_seq', 32, true);


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.photos_id_seq', 8, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.properties_id_seq', 1, false);


--
-- Name: scheme_display_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.scheme_display_cards_id_seq', 5, true);


--
-- Name: schemes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schemes_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.videos_id_seq', 3, true);


--
-- Name: whats_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.whats_new_id_seq', 3, true);


--
-- Name: allowance_heads allowance_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allowance_heads
    ADD CONSTRAINT allowance_heads_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: budget_heads budget_heads_head_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_heads
    ADD CONSTRAINT budget_heads_head_code_unique UNIQUE (head_code);


--
-- Name: budget_heads budget_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.budget_heads
    ADD CONSTRAINT budget_heads_pkey PRIMARY KEY (id);


--
-- Name: court_cases court_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.court_cases
    ADD CONSTRAINT court_cases_pkey PRIMARY KEY (id);


--
-- Name: da_master da_master_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.da_master
    ADD CONSTRAINT da_master_pkey PRIMARY KEY (id);


--
-- Name: deduction_heads deduction_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deduction_heads
    ADD CONSTRAINT deduction_heads_pkey PRIMARY KEY (id);


--
-- Name: employee_allowances employee_allowances_employee_id_allowance_head_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_employee_id_allowance_head_id_key UNIQUE (employee_id, allowance_head_id);


--
-- Name: employee_allowances employee_allowances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_pkey PRIMARY KEY (id);


--
-- Name: employee_deductions employee_deductions_employee_id_deduction_head_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_deductions
    ADD CONSTRAINT employee_deductions_employee_id_deduction_head_id_key UNIQUE (employee_id, deduction_head_id);


--
-- Name: employee_deductions employee_deductions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_deductions
    ADD CONSTRAINT employee_deductions_pkey PRIMARY KEY (id);


--
-- Name: employee_leaves employee_leaves_employee_id_leave_head_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leaves
    ADD CONSTRAINT employee_leaves_employee_id_leave_head_id_key UNIQUE (employee_id, leave_head_id);


--
-- Name: employee_leaves employee_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leaves
    ADD CONSTRAINT employee_leaves_pkey PRIMARY KEY (id);


--
-- Name: employees employees_emp_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_emp_code_unique UNIQUE (emp_code);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: finance_transactions finance_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_pkey PRIMARY KEY (id);


--
-- Name: grievance_roles grievance_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_roles
    ADD CONSTRAINT grievance_roles_pkey PRIMARY KEY (id);


--
-- Name: grievance_sections grievance_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_sections
    ADD CONSTRAINT grievance_sections_pkey PRIMARY KEY (id);


--
-- Name: grievance_subjects grievance_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievance_subjects
    ADD CONSTRAINT grievance_subjects_pkey PRIMARY KEY (id);


--
-- Name: grievances grievances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_pkey PRIMARY KEY (id);


--
-- Name: grievances grievances_ticket_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grievances
    ADD CONSTRAINT grievances_ticket_no_unique UNIQUE (ticket_no);


--
-- Name: leave_heads leave_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_heads
    ADD CONSTRAINT leave_heads_pkey PRIMARY KEY (id);


--
-- Name: lic_entries lic_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lic_entries
    ADD CONSTRAINT lic_entries_pkey PRIMARY KEY (id);


--
-- Name: maintenance_charges maintenance_charges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_charges
    ADD CONSTRAINT maintenance_charges_pkey PRIMARY KEY (id);


--
-- Name: maintenance_properties maintenance_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_properties
    ADD CONSTRAINT maintenance_properties_pkey PRIMARY KEY (id);


--
-- Name: maintenance_properties maintenance_properties_property_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_properties
    ADD CONSTRAINT maintenance_properties_property_no_unique UNIQUE (property_no);


--
-- Name: maintenance_rate_slabs maintenance_rate_slabs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_rate_slabs
    ADD CONSTRAINT maintenance_rate_slabs_pkey PRIMARY KEY (id);


--
-- Name: maintenance_receipts maintenance_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance_receipts
    ADD CONSTRAINT maintenance_receipts_pkey PRIMARY KEY (id);


--
-- Name: marquee_items marquee_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.marquee_items
    ADD CONSTRAINT marquee_items_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: officials officials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.officials
    ADD CONSTRAINT officials_pkey PRIMARY KEY (id);


--
-- Name: payroll_banks payroll_banks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_banks
    ADD CONSTRAINT payroll_banks_pkey PRIMARY KEY (id);


--
-- Name: payroll_branches payroll_branches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_branches
    ADD CONSTRAINT payroll_branches_pkey PRIMARY KEY (id);


--
-- Name: payroll_designations payroll_designations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_designations
    ADD CONSTRAINT payroll_designations_pkey PRIMARY KEY (id);


--
-- Name: payroll_groups payroll_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_groups
    ADD CONSTRAINT payroll_groups_pkey PRIMARY KEY (id);


--
-- Name: payroll_house_types payroll_house_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_house_types
    ADD CONSTRAINT payroll_house_types_pkey PRIMARY KEY (id);


--
-- Name: payroll_paybill_groups payroll_paybill_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_paybill_groups
    ADD CONSTRAINT payroll_paybill_groups_pkey PRIMARY KEY (id);


--
-- Name: payroll_qualifications payroll_qualifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_qualifications
    ADD CONSTRAINT payroll_qualifications_pkey PRIMARY KEY (id);


--
-- Name: payroll_records payroll_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT payroll_records_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: properties properties_property_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_property_no_unique UNIQUE (property_no);


--
-- Name: scheme_display_cards scheme_display_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheme_display_cards
    ADD CONSTRAINT scheme_display_cards_pkey PRIMARY KEY (id);


--
-- Name: schemes schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schemes
    ADD CONSTRAINT schemes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: whats_new whats_new_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whats_new
    ADD CONSTRAINT whats_new_pkey PRIMARY KEY (id);


--
-- Name: idx_lic_employee_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lic_employee_id ON public.lic_entries USING btree (employee_id);


--
-- Name: employee_allowances employee_allowances_allowance_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_allowance_head_id_fkey FOREIGN KEY (allowance_head_id) REFERENCES public.allowance_heads(id) ON DELETE CASCADE;


--
-- Name: employee_allowances employee_allowances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_allowances
    ADD CONSTRAINT employee_allowances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_deductions employee_deductions_deduction_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_deductions
    ADD CONSTRAINT employee_deductions_deduction_head_id_fkey FOREIGN KEY (deduction_head_id) REFERENCES public.deduction_heads(id) ON DELETE CASCADE;


--
-- Name: employee_deductions employee_deductions_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_deductions
    ADD CONSTRAINT employee_deductions_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_leaves employee_leaves_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leaves
    ADD CONSTRAINT employee_leaves_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_leaves employee_leaves_leave_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leaves
    ADD CONSTRAINT employee_leaves_leave_head_id_fkey FOREIGN KEY (leave_head_id) REFERENCES public.leave_heads(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict wEZvLm2oPgabtFdzotYlU7lj9YoQ92acSzHvklzkxlGAYmee1u1B69h3Ce2o6go

