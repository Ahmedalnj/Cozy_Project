import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

String formatDate(DateTime date, {String pattern = 'MMM d, yyyy'}) {
  return DateFormat(pattern).format(date);
}

String formatDateRange(DateTimeRange range) {
  final df = DateFormat('MMM d');
  return '${df.format(range.start)} → ${df.format(range.end)}';
}
