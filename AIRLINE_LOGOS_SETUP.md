# Airline Logo Setup Guide

## Option 1: Using External API (Current Implementation)
The current implementation uses aviationstack.com API for logos with fallback to local files.

## Option 2: Download Popular Airline Logos
You can download logos for common airlines and place them in `/public/airline-logos/` directory.

### Popular Airlines in your test data:
- AA (American Airlines)
- AT (Royal Air Maroc)

### Recommended Logo Sources:
1. **Wikipedia Commons** - Free airline logos
2. **Airlines official websites** - Brand assets section
3. **Logo databases** - Various free logo collections

### File naming convention:
- `aa.png` for American Airlines
- `at.png` for Royal Air Maroc
- etc. (lowercase airline code)

### Recommended logo specifications:
- Format: PNG with transparent background
- Size: 64x64px or 128x128px
- Quality: High resolution for crisp display

## Option 3: Alternative Logo APIs
1. **Clearbit Logo API**: `https://logo.clearbit.com/[airline-domain].com`
2. **Logo.dev**: `https://img.logo.dev/[airline-domain].com`
3. **Brandfetch API**: Requires API key but has extensive collection

## Current Fallback System:
1. Try aviationstack.com API
2. Try local file in `/public/airline-logos/`
3. Show airline code in colored circle

This ensures logos always display something, even if external services are down.
