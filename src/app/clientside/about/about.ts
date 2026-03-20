import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

const SUBMISSIONS_KEY = 'ar_submissions';

interface HallRentalForm {
  name: string;
  phone: string;
  email: string;
  date: string;
  purpose: string;
  guests: string;
  notes: string;
}

@Component({
  selector: 'app-about',
  imports: [FormsModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  readonly currentYear = new Date().getFullYear();

  form: HallRentalForm = {
    name: '', phone: '', email: '', date: '', purpose: '', guests: '', notes: '',
  };

  submitted = signal(false);
  submitting = signal(false);
  formError = signal('');

  readonly officials = [
    { role: 'Punong Barangay', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'Kagawad', name: 'Hon. [Name]', img: '' },
    { role: 'SK Chairperson', name: 'Hon. [Name]', img: '' },
    { role: 'Barangay Secretary', name: '[Name]', img: '' },
    { role: 'Barangay Treasurer', name: '[Name]', img: '' },
  ];

  readonly services = [
    { icon: '💉', title: 'Health Services', desc: 'Free medical consultations, vaccination programs, and health monitoring for all residents.' },
    { icon: '📚', title: 'Livelihood Programs', desc: 'Skills training, livelihood seminars, and micro-financing assistance for qualified residents.' },
    { icon: '🛡️', title: 'Peace & Order', desc: 'Barangay tanod patrols, dispute resolution, and community safety programs.' },
    { icon: '🌱', title: 'Environmental Programs', desc: 'Solid waste management, tree planting drives, and community clean-up activities.' },
    { icon: '📋', title: 'Civil Registration', desc: 'Barangay clearances, certificates of residency, and indigency assistance.' },
    { icon: '🤝', title: 'Social Welfare', desc: 'Assistance for senior citizens, persons with disability (PWD), and indigent families.' },
  ];

  submitHallRental(): void {
    this.formError.set('');
    if (!this.form.name.trim() || !this.form.phone.trim() || !this.form.date || !this.form.purpose.trim()) {
      this.formError.set('Please fill in all required fields.');
      return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      try {
        const submission = {
          id: 'sub-' + Date.now(),
          type: 'hall-rental',
          name: this.form.name.trim(),
          submittedAt: new Date().toISOString(),
          status: 'pending',
          eventName: 'Hall Rental Inquiry',
          fields: [
            { label: 'Full Name', value: this.form.name },
            { label: 'Contact Number', value: this.form.phone },
            { label: 'Email Address', value: this.form.email },
            { label: 'Requested Date', value: this.form.date },
            { label: 'Purpose / Event Type', value: this.form.purpose },
            { label: 'Number of Guests', value: this.form.guests },
            { label: 'Additional Notes', value: this.form.notes },
          ].filter(f => f.value.trim()),
        };
        const existing = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
        existing.unshift(submission);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));
      } catch (e) { /* silent */ }
      this.submitting.set(false);
      this.submitted.set(true);
    }, 600);
  }

  resetForm(): void {
    this.form = { name: '', phone: '', email: '', date: '', purpose: '', guests: '', notes: '' };
    this.submitted.set(false);
    this.formError.set('');
  }
}
