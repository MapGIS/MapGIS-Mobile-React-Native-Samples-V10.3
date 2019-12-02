import { mapComponents } from '../utils';
import ConstantPointAnnotation from './add-constant-point-annotation';
import InteractiveAddAnnotation from './interactive-add-annotation';
import DefaultSimpleAnnotationView from './default-simple-annotation-view';
import CustomAnnotationView from './custom-annotation-view';

export default mapComponents('MapAnnotation', {
  ConstantPointAnnotation,
  InteractiveAddAnnotation,
  DefaultSimpleAnnotationView,
  CustomAnnotationView,
});
