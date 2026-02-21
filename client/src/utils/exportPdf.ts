import jsPDF from 'jspdf';
import { format } from 'date-fns';

export function exportTripPdf(trip: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const checkPage = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(trip.destination, pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(trip.country, pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Trip info
  doc.setFontSize(10);
  const startDate = format(new Date(trip.startDate), 'MMM d, yyyy');
  const endDate = format(new Date(trip.endDate), 'MMM d, yyyy');
  doc.text(`Dates: ${startDate} — ${endDate}`, 20, y);
  y += 6;
  doc.text(`Budget: ${trip.budget.toLocaleString()} ${trip.currency}`, 20, y);
  y += 6;
  doc.text(`Travelers: ${trip.numberOfTravelers}`, 20, y);
  y += 6;
  if (trip.departureCity) {
    doc.text(`Route: ${trip.departureCity} → ${trip.city || trip.destination}`, 20, y);
    y += 6;
  }
  y += 6;

  // Itinerary
  if (trip.itinerary?.days?.length) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Itinerary', 20, y);
    y += 8;

    for (const day of trip.itinerary.days) {
      checkPage(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const dayDate = format(new Date(day.date), 'EEEE, MMM d');
      doc.text(`Day ${day.dayNumber}: ${day.theme || ''} — ${dayDate}`, 20, y);
      y += 7;

      for (const activity of day.activities || []) {
        checkPage(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const timeStr = activity.startTime ? `${activity.startTime} — ` : '';
        doc.text(`${timeStr}${activity.name}`, 25, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        if (activity.description) {
          const lines = doc.splitTextToSize(activity.description, pageWidth - 50);
          checkPage(lines.length * 4 + 2);
          doc.text(lines, 25, y);
          y += lines.length * 4 + 1;
        }
        const details = [];
        if (activity.location) details.push(activity.location);
        if (activity.duration) details.push(`${activity.duration} min`);
        if (activity.estimatedCost != null) details.push(`${activity.estimatedCost} ${activity.currency}`);
        if (details.length) {
          doc.setFontSize(8);
          doc.text(details.join(' | '), 25, y);
          y += 5;
        }
        y += 2;
      }
      y += 4;
    }
  }

  // Hotel Suggestions
  if (trip.hotelSuggestions?.hotels?.length) {
    checkPage(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Hotel Suggestions', 20, y);
    y += 8;

    for (const hotel of trip.hotelSuggestions.hotels) {
      checkPage(20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${hotel.name} (${hotel.category})`, 25, y);
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${hotel.area} — ${hotel.priceRange}`, 25, y);
      y += 5;
      if (hotel.whyRecommended) {
        const lines = doc.splitTextToSize(hotel.whyRecommended, pageWidth - 50);
        checkPage(lines.length * 4);
        doc.text(lines, 25, y);
        y += lines.length * 4 + 2;
      }
      y += 3;
    }
  }

  // Flight Suggestions
  if (trip.flightSuggestions?.flights?.length) {
    checkPage(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Suggestions', 20, y);
    y += 8;

    for (const flight of trip.flightSuggestions.flights) {
      checkPage(15);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${flight.airline} — ~${flight.estimatedPrice} ${flight.currency}`, 25, y);
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${flight.route} | ${flight.duration} | ${flight.class}`, 25, y);
      y += 7;
    }
  }

  // Ground Transport
  if (trip.groundTransportSuggestions?.transportOptions?.length) {
    checkPage(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Ground Transportation', 20, y);
    y += 6;
    if (trip.groundTransportSuggestions.nearestAirport) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`From: ${trip.groundTransportSuggestions.nearestAirport}`, 25, y);
      y += 6;
    }

    for (const opt of trip.groundTransportSuggestions.transportOptions) {
      checkPage(12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${opt.mode} — ${opt.provider}`, 25, y);
      y += 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${opt.route} | ${opt.duration} | ~${opt.estimatedPrice} ${opt.currency}`, 25, y);
      y += 7;
    }
  }

  // Footer
  checkPage(15);
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Generated by WanderWise — AI-Powered Travel Planning', pageWidth / 2, y, { align: 'center' });

  const filename = `WanderWise-${trip.destination.replace(/\s+/g, '-')}-Itinerary.pdf`;
  doc.save(filename);
}
