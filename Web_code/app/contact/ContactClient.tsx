"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Container from '../components/ui/Container';
import Heading from '../components/ui/Heading';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactClient = () => {
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(t('contact.success_message'));
        reset();
      } else {
        // تحقق من نوع المحتوى
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            const errorMessage = errorData.error || t('contact.error_message');
            toast.error(errorMessage);
            console.error('Server error:', errorData);
          } catch (jsonError) {
            console.error('Failed to parse JSON error:', jsonError);
            toast.error(t('contact.error_message'));
          }
        } else {
          // إذا لم يكن JSON، اقرأ النص
          const errorText = await response.text();
          console.error('Server returned non-JSON response:', errorText);
          
          if (response.status === 500) {
            toast.error('إعدادات البريد الإلكتروني غير مكتملة. يرجى التواصل مع الإدارة.');
          } else if (response.status === 404) {
            toast.error('صفحة التواصل غير متاحة حالياً. يرجى المحاولة لاحقاً.');
          } else {
            toast.error(t('contact.error_message'));
          }
        }
      }
    } catch (networkError) {
      console.error('Network error:', networkError);
      toast.error(t('contact.error_message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Heading
              title={t('contact.title')}
              subtitle={t('contact.subtitle')}
              center
            />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('contact.get_in_touch')}
                </h3>
                <p className="text-gray-600 mb-8">
                  {t('contact.description')}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {t('contact.email')}
                    </h4>
                    <p className="text-gray-600">info@cozy-libya.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {t('contact.phone')}
                    </h4>
                    <p className="text-gray-600">+218 91 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {t('contact.address')}
                    </h4>
                    <p className="text-gray-600">
                      {t('contact.address_details')}
                    </p>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('contact.send_message')}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    id="name"
                    type="text"
                    label={t('contact.name_label')}
                    register={register}
                    errors={errors}
                    required
                    validation={{
                      required: t('contact.name_required')
                    }}
                    placeholder={t('contact.name_placeholder')}
                  />
                </div>

                <div>
                  <Input
                    id="email"
                    type="email"
                    label={t('contact.email_label')}
                    register={register}
                    errors={errors}
                    required
                    validation={{
                      required: t('contact.email_required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('contact.email_invalid')
                      }
                    }}
                    placeholder={t('contact.email_placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.message_label')}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { 
                      required: t('contact.message_required'),
                      minLength: {
                        value: 10,
                        message: t('contact.message_min_length')
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('contact.message_placeholder')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  label={isSubmitting ? t('contact.sending') : t('contact.send_button')}
                  icon={Send}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactClient; 