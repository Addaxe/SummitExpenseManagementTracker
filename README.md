# Summit

**Summit** is a full-stack fintech expense management platform designed to help employees track, organize, and manage business expenses through a centralized dashboard.

> 🚧 **Status:** Active development

## Overview

Summit is a personal full-stack project exploring the intersection of **software engineering, product design, and financial technology**.

I started Summit to learn more about how expense management platforms are designed and built while developing a full-stack application from the ground up. The project focuses on creating a clean, intuitive experience for employees while building a scalable backend for managing financial data and workflows.

## Current Development

The project is currently focused on the employee experience and frontend architecture.

Current work includes:

- Employee dashboard development
- Responsive frontend interfaces
- User authentication interface
- Expense management workflow design
- Backend architecture with Flask
- PostgreSQL database planning
- UI/UX design and prototyping in Figma

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Flask
- Python

### Database

- PostgreSQL

### Design & Development

- Figma
- Git
- GitHub

## Architecture

Summit is being developed as a full-stack application with a separated frontend and backend.

```text
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
│           Python            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│        Financial Data       │
└─────────────────────────────┘
