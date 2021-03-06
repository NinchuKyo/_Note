//
//  NoteEditorViewController.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <UIKit/UIKit.h>

@class Note;

@interface NoteEditorViewController : UIViewController <UISplitViewControllerDelegate, UIWebViewDelegate>

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@property Note *note;
@property NSDictionary *json;

@property NSURLConnection *urlConnection;
@property NSURLRequest *urlRequest;
@property BOOL authenticated;

@end
