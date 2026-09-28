Summit

Summit is a full-stack fintech expense management platform designed to help employees track, organize, and manage business expenses through a centralized dashboard.

🚧 Status: Active development

Overview

Summit is a personal full-stack project exploring the intersection of software engineering, product design, and financial technology.

I started Summit to learn more about how expense management platforms are designed and built while developing a production-oriented application from the ground up. The project focuses on creating a clean, intuitive experience for employees while building a scalable backend for managing financial data and workflows.

Current Development

The project is currently focused on the employee experience and frontend architecture.

Current work includes:

Employee dashboard development

Responsive frontend interfaces

User authentication interface

Expense management workflow design

Backend architecture with Flask

PostgreSQL database planning

UI/UX design and prototyping in Figma

Tech Stack
Frontend

React

TypeScript

Tailwind CSS

Vite

Backend

Flask

Python

Database

PostgreSQL

Design & Development

Figma

Git

GitHub

Architecture

Summit is being developed as a full-stack application with a separated frontend and backend:

┌─────────────────────────────┐
│        React Frontend       │
│   TypeScript + Tailwind     │
│            + Vite           │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│        Flask Backend        │
│          Python             │
└──────────────┬──────────────┘
               │
               │
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│       Financial Data        │
└─────────────────────────────┘

Design

The application's interface is designed in Figma before implementation. This allows me to iterate on user flows and layouts before translating them into reusable React components.

The design process currently focuses on:

Employee dashboard experience

Expense management workflows

Form usability

Responsive layouts

Consistent component design

Goals

As development continues, Summit will evolve toward a functional expense management system supporting workflows such as:

Employee expense submission

Expense tracking and categorization

Receipt management

Expense approval workflows

User authentication and authorization

Financial data persistence

Employee and manager experiences

Features listed above represent the project's development goals and may not yet be implemented.

What I'm Learning

Summit is also an opportunity to develop a deeper understanding of fintech and full-stack engineering.

Through the project, I'm learning about:

Financial data modeling

REST API design

Relational database design

Frontend/backend integration

Authentication and authorization

Product and UX design

Building software in an unfamiliar domain

Translating product requirements into technical implementations

Project Structure
SummitExpenseManagementTracker/
├── frontend/
│   ├── src/
│   └── ...
├── backend/
│   ├── ...
│   └── ...
├── README.md
└── ...

Development

Summit is actively being developed and its architecture and features will continue to evolve as the project progresses.

Built by Arianna Escobar-Reyes.emp
