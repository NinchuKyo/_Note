//
//  TableViewController.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <UIKit/UIKit.h>

@class NoteEditorViewController;

@interface TableViewController : UITableViewController

@property (strong, nonatomic) NoteEditorViewController *noteEditorViewController;

@property NSDictionary *json;
@property NSURLConnection *urlConnection;
@property NSURLRequest *request;
@property BOOL authenticated;

@end
