/**
 * Calendar Page - Mission Control Week View Calendar
 */
class CalendarPage {
  constructor() {
    this.events = {};
    this.weekOffset = 0;
  }

  getEvents() {
    return {
      "2026-03-12": [
        {
          id: 1,
          title: "Executive Intelligence Demo",
          type: "meeting",
          time: "10:00 AM",
          duration: "1h",
          attendees: ["Marcus Rodriguez", "AI Ventures Team"],
          location: "Zoom",
          priority: "high"
        },
        {
          id: 2,
          title: "Content Review",
          type: "task",
          time: "2:00 PM",
          duration: "30m",
          description: "Review LinkedIn article draft"
        }
      ],
      "2026-03-13": [
        {
          id: 3,
          title: "Kalshi Bot Performance Review",
          type: "milestone",
          time: "9:00 AM",
          duration: "2h",
          description: "Quarterly performance analysis"
        },
        {
          id: 4,
          title: "Client Check-in: DataScale",
          type: "meeting",
          time: "3:00 PM",
          duration: "45m",
          attendees: ["Sarah Wilson"],
          location: "Phone Call"
        }
      ],
      "2026-03-14": [
        {
          id: 5,
          title: "TikTok Video Recording",
          type: "task",
          time: "11:00 AM",
          duration: "1h",
          description: "Record Kalshi bot update video"
        }
      ],
      "2026-03-15": [
        {
          id: 6,
          title: "Revenue Target Deadline",
          type: "deadline",
          time: "11:59 PM",
          description: "March revenue milestone check",
          priority: "critical"
        },
        {
          id: 7,
          title: "New Client Onboarding",
          type: "meeting",
          time: "1:00 PM",
          duration: "1.5h",
          attendees: ["Alex Chen", "TechFlow Team"],
          location: "Office"
        }
      ],
      "2026-03-16": [
        {
          id: 8,
          title: "Weekend Planning",
          type: "task",
          time: "6:00 PM",
          duration: "30m",
          description: "Plan next week's priorities"
        }
      ],
      "2026-03-23": [
        {
          id: 9,
          title: "Japan Flight",
          type: "milestone",
          time: "All Day",
          duration: "",
          description: "Flight to Japan",
          priority: "high"
        }
      ],
      "2026-03-28": [
        {
          id: 10,
          title: "AnimeJapan (Day 1)",
          type: "milestone",
          time: "10:00 AM",
          duration: "8h",
          description: "AnimeJapan 2026 - Day 1",
          priority: "high"
        }
      ],
      "2026-03-29": [
        {
          id: 11,
          title: "AnimeJapan (Day 2)",
          type: "milestone",
          time: "10:00 AM",
          duration: "8h",
          description: "AnimeJapan 2026 - Day 2"
        }
      ],
      "2026-03-30": [
        {
          id: 12,
          title: "AnimeJapan (Day 3)",
          type: "milestone",
          time: "10:00 AM",
          duration: "8h",
          description: "AnimeJapan 2026 - Day 3"
        },
        {
          id: 13,
          title: "Birthday",
          type: "milestone",
          time: "All Day",
          duration: "",
          description: "Happy Birthday!",
          priority: "high"
        }
      ],
      "2026-03-31": [
        {
          id: 14,
          title: "AnimeJapan (Day 4)",
          type: "milestone",
          time: "10:00 AM",
          duration: "8h",
          description: "AnimeJapan 2026 - Final Day"
        }
      ],
      "2026-04-12": [
        {
          id: 15,
          title: "$50K Deadline",
          type: "deadline",
          time: "11:59 PM",
          duration: "",
          description: "$50K revenue target deadline",
          priority: "critical"
        }
      ]
    };
  }

  getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset + (this.weekOffset * 7));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }

  getTimeSlots() {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      return {
        time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        hour24: `${hour.toString().padStart(2, '0')}:00`
      };
    });
  }

  getUpcomingEvents(events) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const allEvents = [];
    for (const [dateKey, dayEvents] of Object.entries(events)) {
      const eventDate = new Date(dateKey + 'T00:00:00');
      if (eventDate >= now) {
        for (const event of dayEvents) {
          allEvents.push({ ...event, dateKey });
        }
      }
    }

    allEvents.sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey));
    return allEvents.slice(0, 8);
  }

  formatDateRange(weekDays) {
    const opts1 = { month: 'long', day: 'numeric' };
    const opts2 = { month: 'long', day: 'numeric', year: 'numeric' };
    const start = weekDays[0].toLocaleDateString('en-US', opts1);
    const end = weekDays[6].toLocaleDateString('en-US', opts2);
    return `${start} - ${end}`;
  }

  async render(container, params = []) {
    try {
      this.events = this.getEvents();
      const weekDays = this.getWeekDays();
      const timeSlots = this.getTimeSlots();
      const upcomingEvents = this.getUpcomingEvents(this.events);
      const allEventsFlat = Object.values(this.events).flat();

      container.innerHTML = `
        <style>
          .calendar-nav {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .current-week {
            font-weight: 600;
            color: var(--primary-light);
            min-width: 250px;
            text-align: center;
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: 80px repeat(7, 1fr);
            gap: 1px;
            background: var(--border);
            border-radius: 12px;
            overflow: hidden;
          }

          .calendar-header-row {
            display: contents;
          }

          .time-column-header {
            background: var(--surface-2);
            padding: 16px 8px;
            font-size: 0.8rem;
            font-weight: 700;
            text-align: center;
            color: var(--muted);
          }

          .day-header {
            background: var(--surface-2);
            padding: 16px 8px;
            text-align: center;
          }

          .day-header.today {
            background: rgba(99,102,241,0.1);
            border: 1px solid var(--primary);
          }

          .day-name {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--primary-light);
            margin-bottom: 4px;
          }

          .day-date {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .day-events-count {
            font-size: 0.7rem;
            color: var(--muted);
          }

          .time-row {
            display: contents;
          }

          .time-label {
            background: var(--card);
            padding: 12px 8px;
            font-size: 0.75rem;
            color: var(--muted);
            text-align: center;
            border-right: 1px solid var(--border);
          }

          .time-slot {
            background: var(--card);
            padding: 4px;
            min-height: 50px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .time-slot:hover {
            background: rgba(255,255,255,0.05);
          }

          .event-block {
            background: var(--primary);
            border-radius: 4px;
            padding: 4px 6px;
            margin: 2px 0;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
          }

          .event-block:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }

          .event-meeting {
            background: rgba(99,102,241,0.8);
            border-left-color: var(--primary-light);
          }

          .event-task {
            background: rgba(34,211,238,0.8);
            border-left-color: var(--cyan);
          }

          .event-deadline {
            background: rgba(248,113,113,0.8);
            border-left-color: var(--red);
          }

          .event-milestone {
            background: rgba(52,211,153,0.8);
            border-left-color: var(--green);
          }

          .priority-high {
            border-left-width: 4px;
          }

          .priority-critical {
            border-left-width: 5px;
            box-shadow: 0 0 8px rgba(248,113,113,0.5);
          }

          .event-title {
            font-size: 0.7rem;
            font-weight: 600;
            color: white;
            margin-bottom: 1px;
          }

          .event-time {
            font-size: 0.6rem;
            color: rgba(255,255,255,0.8);
          }

          .event-duration {
            font-size: 0.6rem;
            color: rgba(255,255,255,0.6);
          }

          .upcoming-events {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .upcoming-event {
            display: flex;
            gap: 12px;
            padding: 12px;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            position: relative;
          }

          .event-date {
            text-align: center;
            min-width: 50px;
          }

          .event-day {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-light);
          }

          .event-month {
            font-size: 0.7rem;
            color: var(--muted);
            text-transform: uppercase;
          }

          .event-details {
            flex: 1;
          }

          .event-title-upcoming {
            font-weight: 600;
            font-size: 0.85rem;
            margin-bottom: 4px;
          }

          .event-meta {
            font-size: 0.75rem;
            color: var(--muted);
            margin-bottom: 4px;
          }

          .event-attendees {
            font-size: 0.7rem;
            color: var(--dim);
          }

          .event-type-indicator {
            position: absolute;
            top: 50%;
            right: 12px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            transform: translateY(-50%);
          }

          .calendar-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }

          .stat-item {
            text-align: center;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
          }

          .stat-number {
            font-size: 2rem;
            font-weight: 900;
            color: var(--primary-light);
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 0.8rem;
            color: var(--muted);
          }

          .event-legend {
            border-top: 1px solid var(--border);
            padding-top: 16px;
          }

          .legend-title {
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--muted);
            margin-bottom: 12px;
          }

          .legend-items {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: var(--muted);
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          @media (max-width: 768px) {
            .calendar-grid {
              grid-template-columns: 60px repeat(7, 1fr);
            }

            .time-column-header,
            .time-label {
              padding: 8px 4px;
              font-size: 0.7rem;
            }

            .day-header {
              padding: 8px 4px;
            }

            .event-title {
              font-size: 0.6rem;
            }

            .calendar-nav {
              flex-direction: column;
              gap: 8px;
            }

            .current-week {
              min-width: auto;
            }
          }
        </style>

        <div class="grid grid-1">
          <!-- Calendar Header -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📅 Week View</span>
              <div class="calendar-nav">
                <button class="btn btn-secondary" data-action="navigate-week" data-direction="-1">← Previous</button>
                <span class="current-week">
                  ${this.formatDateRange(weekDays)}
                </span>
                <button class="btn btn-secondary" data-action="navigate-week" data-direction="1">Next →</button>
              </div>
            </div>
          </div>

          <!-- Week Calendar Grid -->
          <div class="card">
            <div class="calendar-grid">
              <!-- Header row with days -->
              <div class="calendar-header-row">
                <div class="time-column-header">Time</div>
                ${weekDays.map(day => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayEvents = this.events[day.toISOString().split('T')[0]] || [];

                  return `
                    <div class="day-header ${isToday ? 'today' : ''}">
                      <div class="day-name">${day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div class="day-date">${day.getDate()}</div>
                      <div class="day-events-count">${dayEvents.length} events</div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Time slots -->
              ${timeSlots.map(slot => `
                <div class="time-row">
                  <div class="time-label">${slot.time}</div>
                  ${weekDays.map(day => {
                    const dateKey = day.toISOString().split('T')[0];
                    const dayEvents = this.events[dateKey] || [];
                    const slotEvents = dayEvents.filter(event => event.time.includes(slot.time.split(':')[0]));

                    return `
                      <div class="time-slot" data-date="${dateKey}" data-time="${slot.hour24}">
                        ${slotEvents.map(event => `
                          <div class="event-block event-${event.type} priority-${event.priority || 'normal'}"
                               data-event-id="${event.id}"
                               data-action="show-event">
                            <div class="event-title">${event.title}</div>
                            <div class="event-time">${event.time}</div>
                            ${event.duration ? `<div class="event-duration">${event.duration}</div>` : ''}
                          </div>
                        `).join('')}
                      </div>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Upcoming Events and Quick Stats -->
          <div class="grid grid-2">
            <!-- Upcoming Events -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">⏰ Upcoming Events</span>
                <span class="badge badge-blue">${upcomingEvents.length} Upcoming</span>
              </div>
              <div class="upcoming-events">
                ${upcomingEvents.map(event => {
                  const eventDay = new Date(event.dateKey + 'T00:00:00');

                  return `
                    <div class="upcoming-event">
                      <div class="event-date">
                        <div class="event-day">${eventDay.getDate()}</div>
                        <div class="event-month">${eventDay.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      </div>
                      <div class="event-details">
                        <div class="event-title-upcoming">${event.title}</div>
                        <div class="event-meta">
                          <span class="event-time-upcoming">${event.time}</span>
                          ${event.duration ? `• ${event.duration}` : ''}
                          ${event.location ? `• ${event.location}` : ''}
                        </div>
                        ${event.attendees ? `
                          <div class="event-attendees">
                            👥 ${event.attendees.join(', ')}
                          </div>
                        ` : ''}
                      </div>
                      <div class="event-type-indicator event-${event.type}"></div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Calendar Stats -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">📊 Calendar Statistics</span>
              </div>
              <div class="calendar-stats">
                <div class="stat-item">
                  <div class="stat-number">${allEventsFlat.length}</div>
                  <div class="stat-label">Total Events</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">${allEventsFlat.filter(e => e.type === 'meeting').length}</div>
                  <div class="stat-label">Meetings</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">${allEventsFlat.filter(e => e.type === 'deadline').length}</div>
                  <div class="stat-label">Deadlines</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">${allEventsFlat.filter(e => e.priority === 'high' || e.priority === 'critical').length}</div>
                  <div class="stat-label">High Priority</div>
                </div>
              </div>

              <!-- Event Types Legend -->
              <div class="event-legend">
                <div class="legend-title">Event Types</div>
                <div class="legend-items">
                  <div class="legend-item">
                    <div class="legend-color event-meeting"></div>
                    <span>Meeting</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color event-task"></div>
                    <span>Task</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color event-deadline"></div>
                    <span>Deadline</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color event-milestone"></div>
                    <span>Milestone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      this.setupEventListeners(container);

    } catch (error) {
      console.error('Failed to render calendar page:', error);
      container.innerHTML = `
        <div class="card">
          <h2>Calendar Page Error</h2>
          <p>Failed to load calendar data: ${error.message}</p>
          <button class="btn btn-primary" data-action="reload">Retry</button>
        </div>
      `;
      container.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="reload"]')) {
          location.reload();
        }
      });
    }
  }

  setupEventListeners(container) {
    container.addEventListener('click', (e) => {
      const navBtn = e.target.closest('[data-action="navigate-week"]');
      if (navBtn) {
        const direction = parseInt(navBtn.dataset.direction, 10);
        this.weekOffset += direction;
        this.refresh();
        return;
      }

      const eventBlock = e.target.closest('[data-action="show-event"]');
      if (eventBlock) {
        const eventId = parseInt(eventBlock.dataset.eventId, 10);
        this.showEventDetails(eventId);
        return;
      }
    });
  }

  showEventDetails(eventId) {
    let foundEvent = null;
    let foundDate = null;
    for (const [dateKey, dayEvents] of Object.entries(this.events)) {
      const match = dayEvents.find(ev => ev.id === eventId);
      if (match) {
        foundEvent = match;
        foundDate = dateKey;
        break;
      }
    }

    if (!foundEvent) return;

    const details = [
      `Title: ${foundEvent.title}`,
      `Date: ${foundDate}`,
      `Time: ${foundEvent.time}`,
      foundEvent.duration ? `Duration: ${foundEvent.duration}` : null,
      foundEvent.location ? `Location: ${foundEvent.location}` : null,
      foundEvent.description ? `Description: ${foundEvent.description}` : null,
      foundEvent.attendees ? `Attendees: ${foundEvent.attendees.join(', ')}` : null,
      foundEvent.priority ? `Priority: ${foundEvent.priority}` : null,
    ].filter(Boolean).join('\n');

    alert(details);
  }

  async refresh() {
    const container = document.getElementById('content-area');
    await this.render(container);
  }
}

window.PageModules = window.PageModules || {};
window.PageModules['calendar'] = CalendarPage;
